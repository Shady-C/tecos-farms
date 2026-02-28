"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/types";
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBatch, setDeliveryBatch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [batches, setBatches] = useState<string[]>([]);

  function fetchOrders() {
    setLoading(true);
    const params = new URLSearchParams();
    if (deliveryBatch) params.set("delivery_batch", deliveryBatch);
    if (paymentFilter) params.set("payment_status", paymentFilter);
    fetch(`/api/orders?${params}`)
      .then((res) => res.json())
      .then((data: Order[]) => {
        setOrders(Array.isArray(data) ? data : []);
        const unique = new Set<string>();
        (Array.isArray(data) ? data : []).forEach((o) => unique.add(o.delivery_batch));
        setBatches((prev) => {
          const next = new Set(prev);
          unique.forEach((b) => next.add(b));
          return Array.from(next).sort().reverse();
        });
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchOrders();
  }, [deliveryBatch, paymentFilter]);

  async function updateOrder(
    id: string,
    updates: { payment_status?: Order["payment_status"]; order_status?: Order["order_status"] }
  ) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) fetchOrders();
  }

  const exportBatch = deliveryBatch || batches[0] || "";
  const excelUrl = exportBatch
    ? `/api/export/excel?delivery_batch=${encodeURIComponent(exportBatch)}`
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Orders</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm text-stone-600">Batch</label>
          <select
            value={deliveryBatch}
            onChange={(e) => setDeliveryBatch(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px] text-sm"
          >
            <option value="">All</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <label className="text-sm text-stone-600 ml-2">Payment</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px] text-sm"
          >
            <option value="">All</option>
            <option value="unpaid">Unpaid</option>
            <option value="prepaid">Prepaid</option>
            <option value="paid">Paid</option>
          </select>
          {excelUrl && (
            <a
              href={excelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium min-h-[44px] inline-flex items-center"
            >
              Export Excel
            </a>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-stone-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-stone-200 rounded-lg overflow-hidden">
            <thead className="bg-stone-100 text-left text-sm font-medium text-stone-700">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Area</th>
                <th className="p-3">Kilos</th>
                <th className="p-3">Total (TZS)</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map((o) => (
                <tr key={o.id} className="bg-white">
                  <td className="p-3">{o.customer_name}</td>
                  <td className="p-3">{o.phone}</td>
                  <td className="p-3">{o.area}</td>
                  <td className="p-3">{o.kilos}</td>
                  <td className="p-3">{o.total_price.toLocaleString()}</td>
                  <td className="p-3">{o.payment_status}</td>
                  <td className="p-3">{o.order_status}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {o.payment_status !== "paid" && (
                      <button
                        type="button"
                        onClick={() => updateOrder(o.id, { payment_status: "paid" })}
                        className="px-2 py-1 text-sm bg-green-600 text-white rounded"
                      >
                        Mark paid
                      </button>
                    )}
                    {o.payment_status !== "unpaid" && (
                      <button
                        type="button"
                        onClick={() => updateOrder(o.id, { payment_status: "unpaid" })}
                        className="px-2 py-1 text-sm bg-stone-500 text-white rounded"
                      >
                        Unpaid
                      </button>
                    )}
                    {o.order_status !== "confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateOrder(o.id, { order_status: "confirmed" })}
                        className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                      >
                        Confirm
                      </button>
                    )}
                    {o.order_status !== "delivered" && (
                      <button
                        type="button"
                        onClick={() => updateOrder(o.id, { order_status: "delivered" })}
                        className="px-2 py-1 text-sm bg-stone-700 text-white rounded"
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
