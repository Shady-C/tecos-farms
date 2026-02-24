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
 * Returns YYYY-MM-DD for use as delivery_batch.
 */
export function getNextDeliveryBatch(deliveryDay: string): string {
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
