import type { PaymentChoice } from "./PaymentMethodPicker";

const PAY_LABELS: Record<string, string> = {
  mpesa_prepay: "M-Pesa (Prepay)",
  cash: "Cash on Delivery",
  mpesa_delivery: "M-Pesa on Delivery",
};

interface OrderSummaryProps {
  kg: number;
  pricePerKg: number;
  payment: PaymentChoice;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

export default function OrderSummary({ kg, pricePerKg, payment }: OrderSummaryProps) {
  const total = kg * pricePerKg;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--white)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div
        className="px-4 py-3.5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
          color: "var(--muted)",
        }}
      >
        Review before submitting
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-b text-sm" style={{ borderColor: "#f5f0e8" }}>
        <span style={{ color: "var(--muted)" }}>Pork</span>
        <span className="font-semibold" style={{ color: "var(--text)" }}>
          {kg} kg × {fmt(pricePerKg)} TZS
        </span>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-b text-sm" style={{ borderColor: "#f5f0e8" }}>
        <span style={{ color: "var(--muted)" }}>Delivery</span>
        <span className="font-semibold" style={{ color: "var(--green)" }}>
          Free
        </span>
      </div>

      <div className="flex justify-between items-center px-4 py-3 text-sm" style={{ borderBottom: "1.5px solid #f5c9b0" }}>
        <span style={{ color: "var(--muted)" }}>Payment</span>
        <span className="font-semibold" style={{ color: "var(--text)" }}>
          {PAY_LABELS[payment]}
        </span>
      </div>

      <div
        className="flex justify-between items-center px-4 py-4"
        style={{ background: "var(--accent-bg)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
          Total
        </span>
        <span
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--accent)",
          }}
        >
          {fmt(total)}{" "}
          <span style={{ fontSize: 12, fontWeight: 400 }}>TZS</span>
        </span>
      </div>
    </div>
  );
}
