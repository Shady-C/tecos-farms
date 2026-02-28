interface PriceBannerProps {
  pricePerKg: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

export default function PriceBanner({ pricePerKg }: PriceBannerProps) {
  return (
    <div
      className="relative z-10 flex items-center justify-between rounded-[14px] px-4 py-4 mx-auto"
      style={{
        background: "var(--white)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 448,
        transform: "translateY(-20px)",
      }}
    >
      <div className="flex-1 text-center">
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Price per kg
        </div>
        <div
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-space-mono), monospace", color: "var(--accent)" }}
        >
          {fmt(pricePerKg)}
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
          TZS / kg
        </div>
      </div>

      <div
        className="flex-1 text-center"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Min Order
        </div>
        <div
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-space-mono), monospace", color: "var(--accent)" }}
        >
          2 kg
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
          minimum
        </div>
      </div>

      <div
        className="flex-1 text-center"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Delivery
        </div>
        <div
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-space-mono), monospace", color: "var(--accent)" }}
        >
          Free
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
          to your zone
        </div>
      </div>
    </div>
  );
}
