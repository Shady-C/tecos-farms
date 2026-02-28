interface SuccessScreenProps {
  orderId: string;
  kg: number;
  totalTzs: number;
  deliveryBatch: string;
  onNewOrder: () => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function formatDeliveryDate(batch: string) {
  try {
    const d = new Date(batch + "T00:00:00");
    return d.toLocaleDateString("en-TZ", { weekday: "long", month: "long", day: "numeric" });
  } catch {
    return batch;
  }
}

function buildWhatsAppLink(orderId: string, kg: number, total: number) {
  const msg = encodeURIComponent(
    `Hi! I just placed my pork order.\n\nRef: ${orderId}\nKilos: ${kg}kg\nTotal: ${fmt(total)} TZS\n\nPlease confirm. Asante!`
  );
  return `https://wa.me/255712000000?text=${msg}`;
}

export default function SuccessScreen({
  orderId,
  kg,
  totalTzs,
  deliveryBatch,
  onNewOrder,
}: SuccessScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--white)" }}
    >
      {/* Check icon */}
      <div
        className="animate-pop-in flex items-center justify-center rounded-full text-4xl mb-6"
        style={{
          width: 80,
          height: 80,
          background: "var(--green-bg)",
          border: "2px solid var(--green-border)",
        }}
      >
        ✓
      </div>

      <h2
        className="font-extrabold tracking-tight mb-2.5"
        style={{ fontSize: 26, color: "var(--text)", letterSpacing: "-0.02em" }}
      >
        Order Confirmed!
      </h2>
      <p
        className="leading-relaxed mb-8"
        style={{ fontSize: 15, color: "var(--muted)", maxWidth: 280 }}
      >
        Your pork order has been placed. We&apos;ll confirm via WhatsApp shortly.
      </p>

      {/* Order reference */}
      <div
        className="rounded-xl px-6 py-4 mb-8 w-full"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          maxWidth: 360,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-widest mb-1.5"
          style={{ color: "var(--muted)" }}
        >
          Your Order Reference
        </div>
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--accent)",
            wordBreak: "break-all",
          }}
        >
          {orderId.slice(0, 8).toUpperCase()}
        </div>
      </div>

      {/* Order details */}
      <div
        className="w-full rounded-xl overflow-hidden mb-6 text-left"
        style={{
          background: "var(--white)",
          border: "1px solid var(--border)",
          maxWidth: 360,
        }}
      >
        <div className="flex justify-between items-center px-4 py-3 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--muted)" }}>Kilos ordered</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{kg} kg</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--muted)" }}>Total amount</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{fmt(totalTzs)} TZS</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 text-sm">
          <span style={{ color: "var(--muted)" }}>Delivery</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{formatDeliveryDate(deliveryBatch)}</span>
        </div>
      </div>

      {/* WhatsApp button */}
      <a
        href={buildWhatsAppLink(orderId, kg, totalTzs)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-[14px] text-sm font-bold text-white mb-3"
        style={{
          padding: "16px",
          background: "#25D366",
          maxWidth: 360,
          textDecoration: "none",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        Message us on WhatsApp
      </a>

      <button
        onClick={onNewOrder}
        className="text-sm font-medium"
        style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
      >
        Place another order
      </button>
    </div>
  );
}
