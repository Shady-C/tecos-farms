import type { Order } from "@/types";

type StatsGridProps = {
  orders: Order[];
};

function formatCompactTzs(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toLocaleString("en-TZ");
}

export default function StatsGrid({ orders }: StatsGridProps) {
  const totalOrders = orders.length;
  const totalKilos = orders.reduce((sum, order) => sum + Number(order.kilos), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const unpaidOrders = orders.filter((order) => order.payment_status === "unpaid");
  const unpaidAmount = unpaidOrders.reduce((sum, order) => sum + Number(order.total_price), 0);

  const cards = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-TZ"),
      unit: "orders",
      accentClass: "bg-gradient-to-r from-[var(--admin-accent)] to-[var(--admin-accent-2)]",
      meta: `${Math.max(totalOrders - unpaidOrders.length, 0)} settled`,
    },
    {
      label: "Total Kilos",
      value: totalKilos.toLocaleString("en-TZ"),
      unit: "kg",
      accentClass: "bg-[var(--admin-green)]",
      meta: `${totalOrders > 0 ? (totalKilos / totalOrders).toFixed(1) : "0.0"} kg avg`,
    },
    {
      label: "Revenue (Quoted)",
      value: formatCompactTzs(totalRevenue),
      unit: "TZS",
      accentClass: "bg-[var(--admin-yellow)]",
      meta: `${totalRevenue.toLocaleString("en-TZ")} total`,
    },
    {
      label: "Unpaid",
      value: unpaidOrders.length.toLocaleString("en-TZ"),
      unit: "orders",
      accentClass: "bg-[var(--admin-red)]",
      meta: `${unpaidAmount.toLocaleString("en-TZ")} outstanding`,
    },
  ];

  return (
    <section className="mb-7 grid gap-3 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="relative overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5"
        >
          <div className={`absolute inset-x-0 top-0 h-0.5 ${card.accentClass}`} />
          <p className="mb-3 text-[9px] uppercase tracking-[2px] text-[var(--admin-muted)]">{card.label}</p>
          <p className="font-[var(--font-syne)] text-[30px] leading-none font-bold tracking-[-1px] text-[var(--admin-text)]">
            {card.value}
            <span className="ml-1 font-[var(--font-dm-mono)] text-[13px] font-normal text-[var(--admin-muted)]">
              {card.unit}
            </span>
          </p>
          <p className="mt-2 text-[10px] text-[var(--admin-muted)]">{card.meta}</p>
        </article>
      ))}
    </section>
  );
}
