import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/auth";
import { getNextDeliveryBatch } from "@/lib/delivery";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: {
    customer_name?: string;
    phone?: string;
    email?: string;
    area?: string;
    kilos?: number;
    payment_method?: "cash" | "mobile_money";
    prepay?: boolean;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { customer_name, phone, email, area, kilos, payment_method, prepay, notes } = body;
  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof area !== "string" ||
    !area.trim() ||
    typeof kilos !== "number" ||
    kilos <= 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid: customer_name, phone, area, kilos (positive number)" },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("price_per_kg, delivery_day")
    .limit(1)
    .single();

  if (settingsError || !settings) {
    return NextResponse.json(
      { error: "Could not load price settings" },
      { status: 500 }
    );
  }

  const pricePerKg = Number(settings.price_per_kg);
  const deliveryBatch = getNextDeliveryBatch(settings.delivery_day ?? "saturday");
  const totalPrice = Math.round(kilos * pricePerKg);

  // Determine payment status from method + prepay intent
  const resolvedPaymentMethod = payment_method ?? null;
  const paymentStatus =
    resolvedPaymentMethod === "mobile_money" && prepay === true
      ? "prepaid"
      : "unpaid";

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      area: area.trim(),
      kilos,
      price_per_kg: pricePerKg,
      total_price: totalPrice,
      delivery_batch: deliveryBatch,
      payment_method: resolvedPaymentMethod,
      payment_status: paymentStatus,
      order_status: "pending",
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    })
    .select("id, total_price, delivery_batch")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: order.id,
    total_price: order.total_price,
    delivery_batch: order.delivery_batch,
  });
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deliveryBatch = searchParams.get("delivery_batch") ?? undefined;
  const paymentStatus = searchParams.get("payment_status") ?? undefined;

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (deliveryBatch) query = query.eq("delivery_batch", deliveryBatch);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = (data ?? []).map((row) => ({
    id: row.id,
    customer_name: row.customer_name,
    phone: row.phone,
    email: row.email ?? null,
    area: row.area,
    kilos: Number(row.kilos),
    price_per_kg: Number(row.price_per_kg),
    total_price: Number(row.total_price),
    payment_status: row.payment_status,
    payment_method: row.payment_method,
    order_status: row.order_status,
    delivery_batch: row.delivery_batch,
    notes: row.notes,
    created_at: row.created_at,
  }));

  return NextResponse.json(orders);
}
