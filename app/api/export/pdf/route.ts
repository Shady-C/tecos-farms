import { getSession } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { FarmOrderSheet } from "@/components/FarmOrderSheet";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deliveryBatch = searchParams.get("delivery_batch");
  if (!deliveryBatch) {
    return NextResponse.json(
      { error: "Missing delivery_batch query parameter" },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data: rows, error } = await supabase
    .from("orders")
    .select("customer_name, phone, area, kilos, total_price, payment_status")
    .eq("delivery_batch", deliveryBatch)
    .order("area")
    .order("customer_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = (rows ?? []).map((o) => ({
    customer_name: o.customer_name,
    phone: o.phone,
    area: o.area,
    kilos: Number(o.kilos),
    total_price: Number(o.total_price),
    payment_status: o.payment_status,
  }));

  const byArea = new Map<string, typeof orders>();
  for (const o of orders) {
    const list = byArea.get(o.area) ?? [];
    list.push(o);
    byArea.set(o.area, list);
  }
  const groups = Array.from(byArea.entries()).map(([area, orderList]) => ({
    area,
    orders: orderList,
  }));

  if (groups.length === 0) {
    return NextResponse.json(
      { error: "No orders for this delivery batch" },
      { status: 404 }
    );
  }

  const doc = React.createElement(FarmOrderSheet, {
    deliveryBatch,
    groups,
  });

  const buffer = await renderToBuffer(doc as Parameters<typeof renderToBuffer>[0]);
  const filename = `tecos-orders-${deliveryBatch}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
