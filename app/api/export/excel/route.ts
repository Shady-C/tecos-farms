import { getSession } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deliveryBatch = searchParams.get("delivery_date");
  if (!deliveryBatch) {
    return NextResponse.json(
      { error: "Missing delivery_date query parameter" },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data: rows, error } = await supabase
    .from("orders")
    .select(`
      kilos, price_per_kg, total_price, payment_status, order_status,
      customer:customers(name, phone),
      address:addresses(street_address)
    `)
    .eq("delivery_date", deliveryBatch)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type CustomerRow = { name: string; phone: string } | null;
  type AddressRow = { street_address: string } | null;

  const orders = (rows ?? []).map((o) => ({
    name: (o.customer as unknown as CustomerRow)?.name ?? "",
    phone: (o.customer as unknown as CustomerRow)?.phone ?? "",
    address: (o.address as unknown as AddressRow)?.street_address ?? "",
    kilos: Number(o.kilos),
    pricePerKg: Number(o.price_per_kg),
    total: Number(o.total_price),
    payment: o.payment_status,
    status: o.order_status,
  }));

  if (orders.length === 0) {
    return NextResponse.json(
      { error: "No orders for this delivery batch" },
      { status: 404 }
    );
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  const headers = ["Name", "Phone", "Address", "Kilos", "Price/kg (TZS)", "Total (TZS)", "Payment", "Status"];
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  for (const o of orders) {
    sheet.addRow([o.name, o.phone, o.address, o.kilos, o.pricePerKg, o.total, o.payment, o.status]);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `tecos-orders-${deliveryBatch}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
