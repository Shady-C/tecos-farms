"use client";

import { useMemo, useState } from "react";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

type OrdersTableProps = {
  orders: Order[];
  onUpdateOrder: (
    id: string,
    updates: { payment_status?: PaymentStatus; order_status?: OrderStatus }
  ) => Promise<void>;
  busyOrderId?: string | null;
};

type FilterKey = "all" | "confirmed" | "pending" | "delivered" | "unpaid";

const PAGE_SIZE = 8;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function orderBadgeClass(status: OrderStatus): string {
  if (status === "delivered") return "border-[#4caf7d33] bg-[#4caf7d18] text-[var(--admin-green)]";
  if (status === "confirmed") return "border-[#7b8aff33] bg-[#7b8aff18] text-[#8fa0ff]";
  return "border-[#f0c94b33] bg-[#f0c94b18] text-[var(--admin-yellow)]";
}

function paymentBadgeClass(status: PaymentStatus): string {
  if (status === "paid") return "bg-[#4caf7d22] text-[var(--admin-green)]";
  if (status === "prepaid") return "bg-[#f0c94b22] text-[var(--admin-yellow)]";
  return "bg-[#e0525222] text-[var(--admin-red)]";
}

function paymentLabel(order: Order): string {
  if (order.payment_status === "paid") return "Paid";
  if (order.payment_status === "prepaid") return "Prepaid";
  return "Unpaid";
}

function methodLabel(method: Order["payment_method"]): string {
  if (method === "mobile_money") return "M-Pesa";
  if (method === "cash") return "Cash";
  return "—";
}

function statusLabel(status: OrderStatus): string {
  if (status === "pending") return "Pending";
  if (status === "confirmed") return "Confirmed";
  return "Delivered";
}

export default function OrdersTable({ orders, onUpdateOrder, busyOrderId }: OrdersTableProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const total = orders.length;
    const confirmed = orders.filter((order) => order.order_status === "confirmed").length;
    const pending = orders.filter((order) => order.order_status === "pending").length;
    const delivered = orders.filter((order) => order.order_status === "delivered").length;
    const unpaid = orders.filter((order) => order.payment_status === "unpaid").length;
    return { total, confirmed, pending, delivered, unpaid };
  }, [orders]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter === "confirmed" && order.order_status !== "confirmed") return false;
      if (filter === "pending" && order.order_status !== "pending") return false;
      if (filter === "delivered" && order.order_status !== "delivered") return false;
      if (filter === "unpaid" && order.payment_status !== "unpaid") return false;
      if (!keyword) return true;
      return (
        order.customer.name.toLowerCase().includes(keyword) ||
        order.address.street_address.toLowerCase().includes(keyword) ||
        order.customer.phone.toLowerCase().includes(keyword)
      );
    });
  }, [filter, orders, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const chipStyle =
    "rounded-md border px-3 py-1.5 text-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
        <div>
          <h2 className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">Orders</h2>
          <p className="text-[10px] text-[var(--admin-muted)]">
            {filtered.length.toLocaleString("en-TZ")} shown · {orders.length.toLocaleString("en-TZ")} total
          </p>
        </div>
        <p className="text-[10px] text-[var(--admin-muted)]">
          {orders.reduce((sum, order) => sum + Number(order.kilos), 0).toLocaleString("en-TZ")} kg total
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-5 py-3">
        <button
          type="button"
          className={`${chipStyle} ${
            filter === "all"
              ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
              : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
        >
          All ({counts.total})
        </button>
        <button
          type="button"
          className={`${chipStyle} ${
            filter === "confirmed"
              ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
              : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => {
            setFilter("confirmed");
            setPage(1);
          }}
        >
          Confirmed ({counts.confirmed})
        </button>
        <button
          type="button"
          className={`${chipStyle} ${
            filter === "pending"
              ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
              : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => {
            setFilter("pending");
            setPage(1);
          }}
        >
          Pending ({counts.pending})
        </button>
        <button
          type="button"
          className={`${chipStyle} ${
            filter === "delivered"
              ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
              : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => {
            setFilter("delivered");
            setPage(1);
          }}
        >
          Delivered ({counts.delivered})
        </button>
        <button
          type="button"
          className={`${chipStyle} ${
            filter === "unpaid"
              ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
              : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => {
            setFilter("unpaid");
            setPage(1);
          }}
        >
          Unpaid ({counts.unpaid})
        </button>
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search customer..."
          className="ml-auto w-full max-w-[220px] rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-1.5 text-xs text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-dim)] focus:border-[var(--admin-accent)]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead className="bg-[var(--admin-bg)]">
            <tr className="border-b border-[var(--admin-border)]">
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Customer
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Address
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Kilos
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Price (TZS)
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Method
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Order Status
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Payment
              </th>
              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-sm text-[var(--admin-muted)]">
                  No orders found.
                </td>
              </tr>
            ) : (
              pageOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#1e1c18] text-[var(--admin-text)] transition-colors hover:bg-white/[0.04]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[10px] font-semibold text-[var(--admin-muted)]">
                        {initials(order.customer.name)}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{order.customer.name}</p>
                        <p className="text-[10px] text-[var(--admin-muted)]">{order.customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    <p>{order.address.street_address}</p>
                    {order.address.landmark && (
                      <p className="text-[10px] text-[var(--admin-dim)]">{order.address.landmark}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-[var(--font-syne)] text-sm font-semibold">
                      {Number(order.kilos).toLocaleString("en-TZ")}
                    </span>
                    <span className="ml-1 text-[10px] text-[var(--admin-muted)]">kg</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-accent-2)]">
                    {Number(order.total_price).toLocaleString("en-TZ")}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded bg-[var(--admin-surface-2)] px-2 py-1 text-[9px] uppercase tracking-[0.8px] text-[var(--admin-muted)]">
                      {methodLabel(order.payment_method)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[9px] uppercase tracking-[1px] ${orderBadgeClass(order.order_status)}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusLabel(order.order_status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-1 text-[9px] uppercase tracking-[0.8px] ${paymentBadgeClass(order.payment_status)}`}
                    >
                      {paymentLabel(order)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {order.payment_status !== "paid" ? (
                        <button
                          type="button"
                          disabled={busyOrderId === order.id}
                          onClick={() => onUpdateOrder(order.id, { payment_status: "paid" })}
                          className="rounded border border-[#4caf7d66] bg-[#4caf7d1f] px-2 py-1 text-[10px] text-[var(--admin-green)] disabled:opacity-50"
                        >
                          Mark paid
                        </button>
                      ) : null}
                      {order.payment_status !== "unpaid" ? (
                        <button
                          type="button"
                          disabled={busyOrderId === order.id}
                          onClick={() => onUpdateOrder(order.id, { payment_status: "unpaid" })}
                          className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2 py-1 text-[10px] text-[var(--admin-muted)] disabled:opacity-50"
                        >
                          Unpaid
                        </button>
                      ) : null}
                      {order.order_status !== "confirmed" ? (
                        <button
                          type="button"
                          disabled={busyOrderId === order.id}
                          onClick={() => onUpdateOrder(order.id, { order_status: "confirmed" })}
                          className="rounded border border-[#7b8aff66] bg-[#7b8aff1f] px-2 py-1 text-[10px] text-[#8fa0ff] disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      ) : null}
                      {order.order_status !== "delivered" ? (
                        <button
                          type="button"
                          disabled={busyOrderId === order.id}
                          onClick={() => onUpdateOrder(order.id, { order_status: "delivered" })}
                          className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2 py-1 text-[10px] text-[var(--admin-text)] disabled:opacity-50"
                        >
                          Delivered
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--admin-border)] px-5 py-3">
        <span className="text-[10px] text-[var(--admin-muted)]">
          Showing {pageOrders.length} of {filtered.length} orders
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-1 text-[10px] text-[var(--admin-muted)] hover:text-[var(--admin-text)] disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="rounded border border-[var(--admin-accent)] bg-[var(--admin-accent)] px-3 py-1 text-[10px] text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
