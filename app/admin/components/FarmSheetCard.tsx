type FarmSheetCardProps = {
  totalKg: number;
  totalOrders: number;
  pdfUrl?: string | null;
};

export default function FarmSheetCard({
  totalKg,
  totalOrders,
  pdfUrl,
}: FarmSheetCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
        <h3 className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">Farm Sheet</h3>
        <span className="inline-flex items-center gap-1 rounded border border-[#f0c94b33] bg-[#f0c94b18] px-2 py-1 text-[9px] uppercase tracking-[1px] text-[var(--admin-yellow)]">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Not Sent
        </span>
      </div>

      <div className="p-5 text-center">
        <div className="mb-2 text-3xl">🥩</div>
        <h4 className="mb-1 font-[var(--font-syne)] text-[15px] font-semibold text-[var(--admin-text)]">
          Ready to send to farm
        </h4>
        <p className="mb-4 text-[11px] leading-relaxed text-[var(--admin-muted)]">
          Orders are locked in. You can send a farm summary once production starts.
        </p>

        <div className="mb-4 flex gap-2">
          <div className="flex-1 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-2">
            <p className="font-[var(--font-syne)] text-lg font-bold text-[var(--admin-accent)]">
              {totalKg.toLocaleString("en-TZ")}
            </p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[1px] text-[var(--admin-muted)]">Total kg</p>
          </div>
          <div className="flex-1 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-2">
            <p className="font-[var(--font-syne)] text-lg font-bold text-[var(--admin-accent)]">
              {totalOrders.toLocaleString("en-TZ")}
            </p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[1px] text-[var(--admin-muted)]">Bags</p>
          </div>
        </div>

        <button
          type="button"
          title="Placeholder button"
          className="w-full rounded-md bg-[var(--admin-accent)] px-3 py-2.5 text-xs font-medium tracking-[0.5px] text-white hover:bg-[#d05520]"
        >
          Send to Farm via WhatsApp
        </button>
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-[var(--admin-border)] px-3 py-2 text-[11px] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          >
            Download PDF
          </a>
        ) : (
          <button
            type="button"
            title="Placeholder button"
            className="mt-2 w-full rounded-md border border-[var(--admin-border)] px-3 py-2 text-[11px] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]"
          >
            Download PDF
          </button>
        )}
      </div>
    </section>
  );
}
