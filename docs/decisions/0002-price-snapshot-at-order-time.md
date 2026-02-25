# ADR-0002: Snapshot Price at Order Time

**Date:** 2026-02-24
**Status:** Accepted
**Jira:** N/A

## Context

The admin can change the price per kilogram at any time via the settings page. Orders already placed should not be retroactively affected by price changes.

## Decision

When an order is submitted, the current `price_per_kg` is copied from the settings table into the order record. The `total_price` is also computed and stored at submission time. Both values are immutable after order creation.

## Alternatives Considered

- **Reference pricing at read time:** Simpler schema (no price columns on orders), but changing the price would silently alter the total for past orders. Rejected because it creates accounting inconsistencies.
- **Price versioning table:** Tracks price history separately. Over-engineered for current scale; snapshot is simpler and sufficient.

## Consequences

- Each order row is self-contained — you can always reconstruct the invoice without looking up historical prices.
- If the admin changes the price mid-day, orders before and after the change will show different `price_per_kg` values. This is correct behavior.
- Reporting on revenue is straightforward: sum `total_price` from the orders table.
