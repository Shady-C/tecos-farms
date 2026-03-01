# ADR-0004: Relational Schema Redesign — Customers, Addresses, Orders

**Date:** 2026-02-28
**Status:** Accepted
**Jira:** TF-1

## Context

The initial flat `orders` table stored customer identity (name, phone, email), delivery address, and order data all in a single row. As Phase 2 (repeat customer auto-fill, order history) was designed, it became clear the schema had several problems:

1. **No customer identity** — every order duplicated name, phone, email. A customer re-ordering creates a second unrelated row.
2. **`area` was overloaded** — the column conflated free-text street addresses with delivery zone concepts.
3. **Address history impossible** — no way to know which address a past order was delivered to if the customer later updates their address.
4. **Delivery zones in JSONB** — zones were stored as a JSONB array on `settings`, which has no referential integrity and is hard to query.
5. **Accumulated migrations** — 7 incremental migrations in 5 days before any production traffic, making squashing the obvious choice.

## Decision

Normalize the schema into three tables plus settings:

- **`customers`** — one row per unique phone number. Upserted on every order. Natural lookup key is `phone` (unique constraint + index). Sets up Phase 2 auto-fill without a schema change.
- **`addresses`** — one row per address used, append-only. `customer_id` FK links to the customer. When a customer reorders with a different address, a new row is inserted and `is_default` is flipped. Old orders retain their original `address_id`, preserving delivery history.
- **`orders`** — lean table. Only order-specific data: `kilos`, `price_per_kg` (snapshot), `total_price` (snapshot), status enums, `delivery_batch`, `notes`. `customer_id` and `address_id` FKs satisfy the relational link.
- **`settings`** — unchanged structure except `delivery_zones` JSONB column removed (see below).

All 7 existing migrations were squashed into a single `20260228000000_baseline.sql`. Seed data was updated to `20260228100000_seed_data.sql` using the new relational structure.

**Delivery zones deferred to Phase 3.** The driver handles his own routing today; a zone concept adds complexity without providing value at this stage. When maps/routing integration is built in Phase 3, a `delivery_zones` table and a `zone_id` FK on `addresses` can be added as a new migration without breaking the current schema.

## Alternatives Considered

- **Keep flat orders table, add a customers table via FK only** — still leaves address ambiguity; doesn't solve history or `area` overloading.
- **Add zone table now** — zone assignment requires customer knowledge (they pick a zone) or geo data (auto-detect). Since the driver routes manually today, building the infrastructure now is premature.
- **Snapshot all customer/address fields on the order row** — simpler reads but still no auto-fill path; loses the normalization benefit; data duplication.

## Consequences

- API routes now do three sequential writes on order creation: upsert customer → insert address → insert order. No transaction support in Supabase JS client; failures in step 2 or 3 leave orphaned rows (acceptable risk at MVP scale; can be wrapped in a Postgres function in Phase 2 if needed).
- `GET /api/orders` returns orders with nested `customer` and `address` objects from a join query. All admin components updated to use `order.customer.name`, `order.customer.phone`, `order.address.street_address`.
- `ZoneBreakdown` admin component removed. `FarmSheetCard` zone stat removed.
- `ZoneGrid` order form component removed.
- `settings.delivery_zones` column removed from schema and all API routes.
- `types/index.ts` updated: removed `DeliveryZone`, added `Customer` and `Address` interfaces, updated `Order` with nested types.
