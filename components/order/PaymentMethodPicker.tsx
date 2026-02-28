export type PaymentChoice = "mpesa_prepay" | "cash" | "mpesa_delivery";

interface PaymentOption {
  id: PaymentChoice;
  icon: string;
  title: string;
  desc: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "mpesa_prepay",
    icon: "📱",
    title: "M-Pesa (Prepay)",
    desc: "Send money now · Your order is secured",
  },
  {
    id: "cash",
    icon: "🚚",
    title: "Cash on Delivery",
    desc: "Pay when your pork arrives",
  },
  {
    id: "mpesa_delivery",
    icon: "📲",
    title: "M-Pesa on Delivery",
    desc: "Mobile money when delivered",
  },
];

interface PaymentMethodPickerProps {
  selected: PaymentChoice;
  totalTzs: number;
  onChange: (method: PaymentChoice) => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

export default function PaymentMethodPicker({
  selected,
  totalTzs,
  onChange,
}: PaymentMethodPickerProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="flex flex-col gap-2.5 p-3.5">
        {PAYMENT_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all"
              style={{
                border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                background: isSelected ? "var(--accent-bg)" : "var(--surface)",
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-[10px] text-xl flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: isSelected ? "var(--accent)" : "var(--white)",
                  border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                {opt.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? "var(--accent)" : "var(--text)" }}
                >
                  {opt.title}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {opt.desc}
                </div>
              </div>

              {/* Radio dot */}
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 20,
                  height: 20,
                  border: isSelected ? "2px solid var(--accent)" : "2px solid var(--dim)",
                  background: isSelected ? "var(--accent)" : "transparent",
                }}
              >
                {isSelected && (
                  <div className="rounded-full bg-white" style={{ width: 8, height: 8 }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* M-Pesa prepay instructions */}
      {selected === "mpesa_prepay" && (
        <div
          className="mx-3.5 mb-3.5 rounded-[10px] px-4 py-3.5"
          style={{
            background: "var(--green-bg)",
            border: "1.5px solid var(--green-border)",
          }}
        >
          <div
            className="text-xs font-bold mb-2"
            style={{ color: "var(--green)" }}
          >
            📱 M-Pesa Payment Details
          </div>
          <div className="text-xs leading-7" style={{ color: "#2a5a3a" }}>
            Send to: <strong>+255 712 XXX XXX</strong>
            <br />
            Name: <strong>Teco&apos;s Farms</strong>
            <br />
            Amount: <strong>{fmt(totalTzs)} TZS</strong>
            <br />
            Reference: <strong>Your name + PORK</strong>
          </div>
        </div>
      )}
    </div>
  );
}
