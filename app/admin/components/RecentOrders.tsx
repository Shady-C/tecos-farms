import Link from "next/link";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

type RecentOrdersProps = {
  orders: Order[];
};

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
  if (status === "confirmed") return "Confirmed";
  if (status === "delivered") return "Delivered";
  return "Pending";
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const recent = orders.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
        <div>
          <h2 className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">
            Recent Orders
          </h2>
          <p className="text-[10px] text-[var(--admin-muted)]">Latest {recent.length} of {orders.length}</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[10px] text-[var(--admin-accent)] hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse">
          <thead className="bg-[var(--admin-bg)]">
            <tr className="border-b border-[var(--admin-border)]">
              <th className="px-5 py-2.5 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Customer
              </th>
              <th className="px-5 py-2.5 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Kilos
              </th>
              <th className="px-5 py-2.5 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Method
              </th>
              <th className="px-5 py-2.5 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Status
              </th>
              <th className="px-5 py-2.5 text-left text-[9px] font-medium uppercase tracking-[1.5px] text-[var(--admin-dim)]">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-sm text-[var(--admin-muted)]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recent.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#1e1c18] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[10px] font-semibold text-[var(--admin-muted)]">
                        {initials(order.customer.name)}
                      </div>
                      <p className="text-xs font-medium text-[var(--admin-text)]">{order.customer.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">
                      {Number(order.kilos).toLocaleString("en-TZ")}
                    </span>
                    <span className="ml-1 text-[10px] text-[var(--admin-muted)]">kg</span>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {orders.length > 5 && (
        <div className="border-t border-[var(--admin-border)] px-5 py-3">
          <Link
            href="/admin/orders"
            className="text-[11px] text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
          >
            + {orders.length - 5} more orders · View all in Orders →
          </Link>
        </div>
      )}
    </section>
  );
}
