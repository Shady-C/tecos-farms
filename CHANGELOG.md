# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Phase 1 (in review)

### Added

- Public order form (mobile-first) at `/` (home); `/order` redirects to `/`.
- Optional customer **email** on orders: `orders.email` nullable; collected on form and returned in GET/PATCH.
- Order form: country dial-code selector (default +255), optional email field, “Place another order” after success; phone sent as E.164 (`data/countries.json`).
- Admin dashboard: orders list with filters (delivery batch, payment status)
- Order management: mark paid/unpaid, confirm, delivered, notes
- Settings page: price per kg, order cutoff day/time, delivery day
- PDF export by delivery batch (grouped by area)
- Excel export by delivery batch
- Admin authentication via Supabase (email/password)
- Middleware protection for `/admin/*` routes

### Changed

- **Relational schema redesign (ADR-0004):** Flat `orders` table replaced with normalized `customers`, `addresses`, `orders` tables. Customer identity by phone (upsert), addresses append-only with `is_default` flag. `GET /api/orders` returns nested customer + address via join. All admin components updated to new data shape.
- Squashed 7 incremental migrations into single `20260228000000_baseline.sql` baseline before first production deploy.
- **`delivery_batch text` → `delivery_date date`:** Renamed the column and corrected the type from `text` to `date`. Migration `20260228200000_rename_delivery_batch_to_date.sql` backfills existing rows with a `::date` cast. All API routes, types, and the delivery helper lib updated accordingly.
- **Admin dashboard redesigned as cycle-oriented view:** Replaced flat batch dropdown with a week navigator (prev/next arrows) that defaults to the current delivery cycle, fetches orders server-side per cycle, and displays a formatted date label (e.g. "Sat, Mar 7, 2026"). Sidebar "Current Cycle" badge now shows the real next delivery date from settings. `lib/delivery.ts` gains `formatDeliveryDate`, `getPreviousDeliveryDate`, and `getNextDeliveryDateFrom` helpers.

### Removed

- `delivery_zones` JSONB column from `settings` — delivery zones deferred to Phase 3 (maps/routing integration).
- `ZoneBreakdown` admin component — no zone reporting until Phase 3.
- `ZoneGrid` order form component.
- Flat `area`, `address_2`, `landmark` columns from `orders` — replaced by `addresses` table.

### Decisions

- **ADR-0003:** Optional customer email on orders; order form served on home page (`/`), `/order` redirects to `/`.
- **ADR-0004:** Relational schema normalization; delivery zones deferred to Phase 3.
