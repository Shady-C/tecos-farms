interface SubmitBarProps {
  isSubmitting: boolean;
  disabled: boolean;
  formId?: string;
}

export default function SubmitBar({ isSubmitting, disabled, formId }: SubmitBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-5"
      style={{
        background: "var(--white)",
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
        paddingTop: 16,
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
    >
      <button
        type="submit"
        form={formId}
        disabled={disabled || isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-[14px] text-base font-bold text-white transition-all active:scale-[0.98]"
        style={{
          padding: "17px",
          background: disabled || isSubmitting ? "var(--dim)" : "var(--accent)",
          border: "none",
          fontFamily: "var(--font-outfit), sans-serif",
          letterSpacing: "0.01em",
          cursor: disabled || isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Submitting…" : "Confirm My Order 🥩"}
      </button>
      <div
        className="text-center mt-2"
        style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.03em" }}
      >
        You&apos;ll get a WhatsApp confirmation within minutes
      </div>
    </div>
  );
}
