const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/**
 * Get the next occurrence of the given day (e.g. "saturday") from today.
 * Returns YYYY-MM-DD for use as delivery_date.
 */
export function getNextDeliveryDate(deliveryDay: string): string {
  const normalized = deliveryDay.toLowerCase().trim();
  const targetIndex = DAY_NAMES.indexOf(
    normalized as (typeof DAY_NAMES)[number]
  );
  const dayIndex = targetIndex >= 0 ? targetIndex : 6; // default saturday

  const now = new Date();
  const currentDay = now.getDay();
  let daysToAdd = dayIndex - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7;

  const next = new Date(now);
  next.setDate(now.getDate() + daysToAdd);
  return next.toISOString().slice(0, 10);
}

/**
 * Subtract 7 days from a YYYY-MM-DD string (navigate to previous cycle).
 */
export function getPreviousDeliveryDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Add 7 days to a YYYY-MM-DD string (navigate to next cycle).
 */
export function getNextDeliveryDateFrom(dateStr: string): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Format a YYYY-MM-DD delivery date as a human-readable label.
 * e.g. "2026-03-07" → "Sat, Mar 7, 2026"
 */
export function formatDeliveryDate(dateStr: string): string {
  // Parse as UTC so there's no timezone-offset shift on the date label
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
