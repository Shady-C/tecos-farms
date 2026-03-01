import type { Order } from "@/types";

type PaymentSummaryProps = {
  orders: Order[];
};

function ratio(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function PaymentSummary({ orders }: PaymentSummaryProps) {
  const totalQuoted = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const collected = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.total_price), 0);
  const prepaid = orders
    .filter((order) => order.payment_status === "prepaid")
    .reduce((sum, order) => sum + Number(order.total_price), 0);
  const outstanding = orders
    .filter((order) => order.payment_status === "unpaid")
    .reduce((sum, order) => sum + Number(order.total_price), 0);

  const rows = [
    {
      label: "Collected (Cash + M-Pesa)",
      amount: collected,
      colorClass: "bg-[var(--admin-green)]",
      textClass: "text-[var(--admin-green)]",
      width: ratio(collected, totalQuoted),
    },
    {
      label: "Prepaid",
      amount: prepaid,
      colorClass: "bg-[var(--admin-yellow)]",
      textClass: "text-[var(--admin-yellow)]",
      width: ratio(prepaid, totalQuoted),
    },
    {
      label: "Outstanding",
      amount: outstanding,
      colorClass: "bg-[var(--admin-red)]",
      textClass: "text-[var(--admin-red)]",
      width: ratio(outstanding, totalQuoted),
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
        <h3 className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">Payments</h3>
        <p className="text-[10px] text-[var(--admin-muted)]">This cycle</p>
      </div>

      <div className="space-y-3.5 px-5 py-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-[var(--admin-muted)]">{row.label}</span>
              <span className={row.textClass}>{row.amount.toLocaleString("en-TZ")}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded bg-[var(--admin-surface-2)]">
              <div className={`h-full rounded transition-all ${row.colorClass}`} style={{ width: `${row.width}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mx-5 mb-5 flex items-center justify-between rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3">
        <span className="text-[10px] uppercase tracking-[1px] text-[var(--admin-muted)]">Total Quoted</span>
        <span className="font-[var(--font-syne)] text-lg font-bold text-[var(--admin-accent-2)]">
          {totalQuoted.toLocaleString("en-TZ")} TZS
        </span>
      </div>
    </section>
  );
}
