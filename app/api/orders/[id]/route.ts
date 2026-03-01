import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  let body: {
    payment_status?: "unpaid" | "prepaid" | "paid";
    payment_method?: "cash" | "mobile_money" | null;
    order_status?: "pending" | "confirmed" | "delivered";
    notes?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.payment_status !== undefined) updates.payment_status = body.payment_status;
  if (body.payment_method !== undefined) updates.payment_method = body.payment_method;
  if (body.order_status !== undefined) updates.order_status = body.order_status;
  if (body.notes !== undefined) updates.notes = body.notes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      customer:customers(*),
      address:addresses(*)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
