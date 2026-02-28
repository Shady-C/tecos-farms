# Technical Specifications

**Purpose:** Functional specifications per area, interface contracts, and schema (database and message formats).

**See also:** [04-api.md](04-api.md), [supabase/migrations/20260223000001_initial_schema.sql](../supabase/migrations/20260223000001_initial_schema.sql), [docs index](README.md).

---

## Functional specifications

### Order creation

- Accept POST with `customer_name`, `phone`, `area`, `kilos` (validated: non-empty strings, kilos > 0). Optional `email`: if present and non-empty string, trimmed and stored; otherwise null.
- Load current `price_per_kg` and `delivery_day` from settings (single row).
- Compute `delivery_batch` = next occurrence of `delivery_day` (YYYY-MM-DD) via `getNextDeliveryBatch(delivery_day)`.
- Compute `total_price` = round(kilos × price_per_kg).
- Insert row into `orders` with snapshot `price_per_kg`, `total_price`, `delivery_batch`; defaults: `payment_status` unpaid, `order_status` pending.
- Return `id`, `total_price`, `delivery_batch`.

### Order listing and update

- **List:** Admin only. Optional filters: `delivery_batch`, `payment_status`. Order by `created_at` descending. Return array of orders (API shape matches [types](../types/index.ts) `Order`).
- **Update:** Admin only. PATCH by order `id`; allow partial update of `payment_status`, `payment_method`, `order_status`, `notes`. Return updated order or 404.

### Settings CRUD

- **Read (admin):** Return single settings row (id, price_per_kg, order_cutoff_day, order_cutoff_time, delivery_day).
- **Read (public):** Return price_per_kg, delivery_day, order_cutoff_day only (no auth).
- **Update (admin):** PUT with any subset of price_per_kg, order_cutoff_day, order_cutoff_time, delivery_day; update single row; return updated settings.

### Export PDF / Excel

- Admin only. Require query `delivery_batch`. Load orders for that batch (ordered by area, customer_name). PDF: group by area; Excel: flat table. Return file with appropriate Content-Type and Content-Disposition. 404 if no orders for batch.

### Auth and middleware

- **Middleware:** For paths under `/admin`, if not on `/admin/login`, require session; else redirect to `/admin/login`. If on `/admin/login` and session exists, redirect to `/admin/orders`.
- **API auth:** Admin routes call `getSession()`; if null, return 401. Public routes: POST /api/orders, GET /api/settings/public — no session check. DB access for orders/settings write and for public order insert uses service-role client (server-side only).

---

## Interface contracts

### getNextDeliveryBatch

- **Input:** `deliveryDay: string` (e.g. `"saturday"`).
- **Output:** `string` — next occurrence of that weekday as `YYYY-MM-DD`.
- **Location:** [lib/delivery.ts](../lib/delivery.ts).

### API request/response shapes

- See [04-api.md](04-api.md) and [types/index.ts](../types/index.ts) for request bodies and response types (`Order`, `Settings`, public settings subset).

---

## Schema

### Database (Postgres)

**Enums:**

| Type | Values |
|------|--------|
| payment_status | unpaid, prepaid, paid |
| payment_method | cash, mobile_money |
| order_status | pending, confirmed, delivered |

**Table: orders**

| Column | Type | Constraints |
|--------|------|--------------|
| id | uuid | PK, default gen_random_uuid() |
| customer_name | text | NOT NULL |
| phone | text | NOT NULL |
| email | text | nullable (optional at order creation) |
| area | text | NOT NULL |
| kilos | decimal | NOT NULL, CHECK (kilos > 0) |
| price_per_kg | decimal | NOT NULL |
| total_price | decimal | NOT NULL |
| payment_status | payment_status | NOT NULL, default 'unpaid' |
| payment_method | payment_method | nullable |
| order_status | order_status | NOT NULL, default 'pending' |
| delivery_batch | text | NOT NULL |
| notes | text | nullable |
| created_at | timestamptz | NOT NULL, default now() |

**Indexes:** delivery_batch, created_at DESC, payment_status.

**Table: settings** (single row)

| Column | Type | Constraints |
|--------|------|--------------|
| id | uuid | PK, default gen_random_uuid() |
| price_per_kg | decimal | NOT NULL |
| order_cutoff_day | text | NOT NULL |
| order_cutoff_time | time | NOT NULL |
| delivery_day | text | NOT NULL |

### RLS

- **orders:** Policy "No direct access to orders" — FOR ALL, USING (false), WITH CHECK (false). All access via service role in API.
- **settings:** Authenticated users can SELECT and UPDATE; anon cannot access (public price served via service role in API).

**Migration:** [supabase/migrations/20260223000001_initial_schema.sql](../supabase/migrations/20260223000001_initial_schema.sql). Optional `email` added in [20260227000001_add_email_to_orders.sql](../supabase/migrations/20260227000001_add_email_to_orders.sql).

### Message formats (JSON)

- Order create request: `{ customer_name, phone, area, kilos, email? }`.
- Order create response: `{ id, total_price, delivery_batch }`.
- Order list response: array of `Order` (see [types](../types/index.ts)).
- Settings response: `{ id, price_per_kg, order_cutoff_day, order_cutoff_time, delivery_day }`.
- Public settings: `{ price_per_kg, delivery_day?, order_cutoff_day? }`.
- Error: `{ error: string }`.

---

*Update notes: Initial version; reflects codebase as of 2026-02-24. Optional email and order-form-on-home as of 2026-02-27.*
