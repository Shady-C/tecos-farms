interface HeroHeaderProps {
  deliveryDay?: string;
  orderCutoffDay?: string;
  orderCutoffTime?: string;
}

function formatDay(day?: string) {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatCutoffTime(time?: string) {
  if (!time) return "";
  // time is HH:MM:SS from Postgres — format to e.g. "12:00 PM"
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function HeroHeader({ deliveryDay, orderCutoffDay, orderCutoffTime }: HeroHeaderProps) {
  const cutoffLabel = orderCutoffDay
    ? `Orders close ${formatDay(orderCutoffDay)}${orderCutoffTime ? `, ${formatCutoffTime(orderCutoffTime)}` : ""}`
    : "Orders open now";

  const deliveryLabel = deliveryDay
    ? `Delivery ${formatDay(deliveryDay)}`
    : "Delivery this week";

  return (
    <div
      className="relative overflow-hidden px-6 pt-10 pb-12"
      style={{
        background: "var(--accent)",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, #e8621a44 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ff8c4244 0%, transparent 50%)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full"
        style={{
          right: "-40px",
          top: "-40px",
          width: 200,
          height: 200,
          background: "rgba(255,255,255,0.05)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: 30,
          bottom: "-60px",
          width: 150,
          height: 150,
          background: "rgba(255,255,255,0.04)",
        }}
      />

      <div className="relative z-10">
        <div
          className="inline-flex items-center gap-1.5 mb-4 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          🐖 Teco&apos;s Farms · Dar es Salaam
        </div>

        <h1
          className="text-[34px] font-extrabold leading-[1.1] tracking-tight mb-2.5 text-white"
        >
          Fresh Pork<br />
          This <span style={{ color: "#ffd199" }}>Weekend 🥩</span>
        </h1>

        <p className="text-sm font-normal leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          Place your order before {formatDay(orderCutoffDay) || "Saturday"} noon. {deliveryLabel}.
        </p>

        <div
          className="inline-flex items-center gap-2 mt-4 rounded-lg px-3.5 py-2 text-xs font-medium"
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <div
            className="animate-pulse-dot rounded-full"
            style={{ width: 7, height: 7, background: "#7dffc0", flexShrink: 0 }}
          />
          {cutoffLabel}
        </div>
      </div>
    </div>
  );
}
