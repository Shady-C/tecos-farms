import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("settings")
    .select("price_per_kg, delivery_day, order_cutoff_day")
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Settings not found" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    price_per_kg: Number(data.price_per_kg),
    delivery_day: data.delivery_day ?? undefined,
    order_cutoff_day: data.order_cutoff_day ?? undefined,
  });
}
