import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/auth";
import { NextResponse } from "next/server";
import type { MobileMoneyDetails } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Settings not found" },
      { status: 500 }
    );
  }

  const mobileMoneyDetails: MobileMoneyDetails | null =
    data.mobile_money_details && typeof data.mobile_money_details === "object"
      ? data.mobile_money_details
      : null;

  const enabledMethods: string[] = Array.isArray(data.enabled_payment_methods)
    ? data.enabled_payment_methods
    : ["cash", "mobile_money"];

  return NextResponse.json({
    id: data.id,
    price_per_kg: Number(data.price_per_kg),
    min_kg: Number(data.min_kg ?? 1),
    order_cutoff_day: data.order_cutoff_day,
    order_cutoff_time: data.order_cutoff_time,
    delivery_day: data.delivery_day,
    mobile_money_details: mobileMoneyDetails,
    enabled_payment_methods: enabledMethods,
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    price_per_kg?: number;
    min_kg?: number;
    order_cutoff_day?: string;
    order_cutoff_time?: string;
    delivery_day?: string;
    mobile_money_details?: MobileMoneyDetails | null;
    enabled_payment_methods?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.price_per_kg === "number") updates.price_per_kg = body.price_per_kg;
  if (typeof body.min_kg === "number") updates.min_kg = body.min_kg;
  if (typeof body.order_cutoff_day === "string") updates.order_cutoff_day = body.order_cutoff_day;
  if (typeof body.order_cutoff_time === "string") updates.order_cutoff_time = body.order_cutoff_time;
  if (typeof body.delivery_day === "string") updates.delivery_day = body.delivery_day;
  if (body.mobile_money_details !== undefined) updates.mobile_money_details = body.mobile_money_details;
  if (Array.isArray(body.enabled_payment_methods)) updates.enabled_payment_methods = body.enabled_payment_methods;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: current } = await supabase
    .from("settings")
    .select("id")
    .limit(1)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("settings")
    .update(updates)
    .eq("id", current.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mobileMoneyDetails: MobileMoneyDetails | null =
    data.mobile_money_details && typeof data.mobile_money_details === "object"
      ? data.mobile_money_details
      : null;

  const enabledMethods: string[] = Array.isArray(data.enabled_payment_methods)
    ? data.enabled_payment_methods
    : ["cash", "mobile_money"];

  return NextResponse.json({
    id: data.id,
    price_per_kg: Number(data.price_per_kg),
    min_kg: Number(data.min_kg ?? 1),
    order_cutoff_day: data.order_cutoff_day,
    order_cutoff_time: data.order_cutoff_time,
    delivery_day: data.delivery_day,
    mobile_money_details: mobileMoneyDetails,
    enabled_payment_methods: enabledMethods,
  });
}
