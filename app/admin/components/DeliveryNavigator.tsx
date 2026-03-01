"use client";

import {
  formatDeliveryDate,
  getPreviousDeliveryDate,
  getNextDeliveryDateFrom,
} from "@/lib/delivery";

type DeliveryNavigatorProps = {
  selectedDate: string;
  upcomingDate: string;
  orderCount?: number;
  totalKg?: number;
  onNavigate: (date: string) => void;
};

export default function DeliveryNavigator({
  selectedDate,
  upcomingDate,
  orderCount,
  totalKg,
  onNavigate,
}: DeliveryNavigatorProps) {
  const isAtLatest = selectedDate >= upcomingDate;

  const handlePrev = () => onNavigate(getPreviousDeliveryDate(selectedDate));
  const handleNext = () => {
    if (!isAtLatest) onNavigate(getNextDeliveryDateFrom(selectedDate));
  };

  const isCurrentCycle = selectedDate === upcomingDate;

  return (
    <div className="flex flex-col items-start gap-0.5 sm:items-center sm:flex-row sm:gap-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous delivery week"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)] transition-colors"
        >
          ‹
        </button>

        <div className="flex min-w-[9rem] flex-col items-center px-2">
          <span className="font-[var(--font-syne)] text-[13px] font-semibold leading-tight text-[var(--admin-text)] whitespace-nowrap">
            {formatDeliveryDate(selectedDate)}
          </span>
          {isCurrentCycle && (
            <span className="mt-0.5 rounded-sm border border-[#4caf7d44] bg-[#4caf7d22] px-1.5 py-px text-[7px] uppercase tracking-[1.5px] text-[var(--admin-green)]">
              Current cycle
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isAtLatest}
          aria-label="Next delivery week"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-muted)] transition-colors disabled:opacity-30 hover:not-disabled:border-[var(--admin-dim)] hover:not-disabled:text-[var(--admin-text)]"
        >
          ›
        </button>
      </div>

      {(orderCount !== undefined || totalKg !== undefined) && (
        <span className="text-[10px] text-[var(--admin-muted)]">
          {orderCount !== undefined && (
            <>{orderCount.toLocaleString("en-TZ")} orders</>
          )}
          {orderCount !== undefined && totalKg !== undefined && " · "}
          {totalKg !== undefined && (
            <>{totalKg.toLocaleString("en-TZ")} kg</>
          )}
        </span>
      )}
    </div>
  );
}
