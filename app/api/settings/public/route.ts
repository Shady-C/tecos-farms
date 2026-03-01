import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { MobileMoneyDetails } from "@/types";

export async function GET() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("settings")
    .select("price_per_kg, min_kg, delivery_day, order_cutoff_day, order_cutoff_time, mobile_money_details, enabled_payment_methods")
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
    price_per_kg: Number(data.price_per_kg),
    min_kg: Number(data.min_kg ?? 1),
    delivery_day: data.delivery_day ?? undefined,
    order_cutoff_day: data.order_cutoff_day ?? undefined,
    order_cutoff_time: data.order_cutoff_time ?? undefined,
    mobile_money_details: mobileMoneyDetails,
    enabled_payment_methods: enabledMethods,
  });
}
