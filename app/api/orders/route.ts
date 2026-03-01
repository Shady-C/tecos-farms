import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/auth";
import { getNextDeliveryDate } from "@/lib/delivery";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: {
    customer_name?: string;
    phone?: string;
    email?: string;
    street_address?: string;
    address_line_2?: string;
    landmark?: string;
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

  const { customer_name, phone, email, street_address, address_line_2, landmark, kilos, payment_method, prepay, notes } = body;

  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof street_address !== "string" ||
    !street_address.trim() ||
    typeof kilos !== "number" ||
    kilos <= 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid: customer_name, phone, street_address, kilos (positive number)" },
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
    return NextResponse.json({ error: "Could not load price settings" }, { status: 500 });
  }

  const pricePerKg = Number(settings.price_per_kg);
  const deliveryDate = getNextDeliveryDate(settings.delivery_day ?? "saturday");
  const totalPrice = Math.round(kilos * pricePerKg);

  const resolvedPaymentMethod = payment_method ?? null;
  const paymentStatus =
    resolvedPaymentMethod === "mobile_money" && prepay === true ? "prepaid" : "unpaid";

  // 1. Upsert customer by phone (phone is the natural identity key)
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        name: customer_name.trim(),
        phone: phone.trim(),
        email: typeof email === "string" && email.trim() ? email.trim() : null,
      },
      { onConflict: "phone" }
    )
    .select("id")
    .single();

  if (customerError || !customer) {
    return NextResponse.json({ error: customerError?.message ?? "Could not create customer" }, { status: 500 });
  }

  // 2. Mark any previous default address as non-default, then insert the new address
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("customer_id", customer.id);

  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .insert({
      customer_id: customer.id,
      street_address: street_address.trim(),
      address_line_2: typeof address_line_2 === "string" && address_line_2.trim() ? address_line_2.trim() : null,
      landmark: typeof landmark === "string" && landmark.trim() ? landmark.trim() : null,
      is_default: true,
    })
    .select("id")
    .single();

  if (addressError || !address) {
    return NextResponse.json({ error: addressError?.message ?? "Could not create address" }, { status: 500 });
  }

  // 3. Insert the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      address_id: address.id,
      kilos,
      price_per_kg: pricePerKg,
      total_price: totalPrice,
      delivery_date: deliveryDate,
      payment_method: resolvedPaymentMethod,
      payment_status: paymentStatus,
      order_status: "pending",
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    })
    .select("id, total_price, delivery_date")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Could not create order" }, { status: 500 });
  }

  return NextResponse.json({
    id: order.id,
    total_price: order.total_price,
    delivery_date: order.delivery_date,
  });
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deliveryDate = searchParams.get("delivery_date") ?? undefined;
  const paymentStatus = searchParams.get("payment_status") ?? undefined;

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("orders")
    .select(`
      *,
      customer:customers(*),
      address:addresses(*)
    `)
    .order("created_at", { ascending: false });

  if (deliveryDate) query = query.eq("delivery_date", deliveryDate);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
