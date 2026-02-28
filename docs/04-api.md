# API Documentation

**Purpose:** Reference for all API endpoints: methods, auth, request/response shapes, error codes, and examples.

**See also:** [types/index.ts](../types/index.ts), [03-architecture.md](03-architecture.md), [06-technical-specs.md](06-technical-specs.md), [docs index](README.md).

---

## Overview

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/orders` | POST | None | Create order |
| `/api/orders` | GET | Session | List orders (optional filters) |
| `/api/orders/[id]` | PATCH | Session | Update order |
| `/api/settings` | GET | Session | Read settings |
| `/api/settings` | PUT | Session | Update settings |
| `/api/settings/public` | GET | None | Public price and delivery info |
| `/api/export/pdf` | GET | Session | PDF by delivery_batch |
| `/api/export/excel` | GET | Session | Excel by delivery_batch |

**Authentication:** Admin endpoints require a valid Supabase session (cookie). Public endpoints: `POST /api/orders` and `GET /api/settings/public` require no auth.

---

## Error responses

All JSON errors include an `error` string. Common status codes:

| Status | Meaning |
|--------|---------|
| 400 | Bad request (validation, invalid JSON, or no fields to update) |
| 401 | Unauthorized (missing or invalid session for admin routes) |
| 404 | Not found (e.g. order id, or no orders for delivery_batch on export) |
| 500 | Server error (DB or settings load failure) |

---

## Endpoints

### POST /api/orders

Create a new order. No auth. Server sets price from settings and next delivery batch.

**Request (JSON body):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customer_name | string | Yes | Non-empty, trimmed |
| phone | string | Yes | Non-empty, trimmed (e.g. E.164: +255712345678) |
| email | string | No | Optional; trimmed or omitted → stored as null |
| area | string | Yes | Non-empty, trimmed (delivery zone) |
| kilos | number | Yes | Positive number |

**Success (200):**

```json
{
  "id": "uuid",
  "total_price": 120000,
  "delivery_batch": "2026-03-01"
}
```

**Errors:** 400 (invalid/missing fields), 500 (settings load or insert failed).

**Example (cURL):**

```bash
curl -X POST https://your-app.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Jane","phone":"+255712345678","area":"Kinondoni","kilos":10}'
```

**Example (fetch):**

```javascript
const res = await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customer_name: "Jane",
    phone: "+255712345678",
    area: "Kinondoni",
    kilos: 10,
    email: "jane@example.com",  // optional
  }),
});
const data = await res.json(); // { id, total_price, delivery_batch }
```

---

### GET /api/orders

List orders (admin). Requires session.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| delivery_batch | string | Filter by batch (e.g. "2026-03-01") |
| payment_status | string | Filter: unpaid, prepaid, paid |

**Success (200):** JSON array of orders (see [types/index.ts](../types/index.ts) `Order`). Each order includes `email` (string or null). Numbers for `kilos`, `price_per_kg`, `total_price` are serialized as numbers.

**Errors:** 401 (no session), 500 (DB error).

**Example (fetch with cookies):** Browser sends session cookie automatically when same-origin. For server or script, include the session cookie in the request.

```javascript
const res = await fetch("/api/orders?delivery_batch=2026-03-01");
const orders = await res.json();
```

---

### PATCH /api/orders/[id]

Update an order (admin). Requires session.

**Request (JSON body):** Any subset of:

| Field | Type | Description |
|-------|------|-------------|
| payment_status | "unpaid" \| "prepaid" \| "paid" | Optional |
| payment_method | "cash" \| "mobile_money" \| null | Optional |
| order_status | "pending" \| "confirmed" \| "delivered" | Optional |
| notes | string \| null | Optional |

At least one field required.

**Success (200):** Full order object (same shape as GET /api/orders item).

**Errors:** 400 (no fields / invalid JSON), 401, 404 (order not found), 500.

**Example:**

```bash
curl -X PATCH https://your-app.vercel.app/api/orders/ORDER_UUID \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-...=..." \
  -d '{"payment_status":"paid"}'
```

---

### GET /api/settings

Read settings (admin). Requires session.

**Success (200):**

```json
{
  "id": "uuid",
  "price_per_kg": 12000,
  "order_cutoff_day": "wednesday",
  "order_cutoff_time": "23:59:00",
  "delivery_day": "saturday"
}
```

**Errors:** 401, 500.

---

### PUT /api/settings

Update settings (admin). Requires session.

**Request (JSON body):** Any subset of:

| Field | Type | Description |
|-------|------|-------------|
| price_per_kg | number | Optional |
| order_cutoff_day | string | Optional |
| order_cutoff_time | string | Optional (e.g. "23:59:00") |
| delivery_day | string | Optional |

At least one field required.

**Success (200):** Same shape as GET /api/settings.

**Errors:** 400 (no fields), 401, 500.

---

### GET /api/settings/public

Public price and delivery info. No auth.

**Success (200):**

```json
{
  "price_per_kg": 12000,
  "delivery_day": "saturday",
  "order_cutoff_day": "wednesday"
}
```

**Errors:** 500 (e.g. settings not found).

---

### GET /api/export/pdf

Download PDF for a delivery batch (admin). Requires session.

**Query parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| delivery_batch | string | Yes | e.g. "2026-03-01" |

**Success (200):** Binary PDF; `Content-Type: application/pdf`; `Content-Disposition: attachment; filename="tecos-orders-YYYY-MM-DD.pdf"`.

**Errors:** 400 (missing delivery_batch), 401, 404 (no orders for batch), 500.

**Example:** Open in browser with session (same-origin):  
`/api/export/pdf?delivery_batch=2026-03-01`

---

### GET /api/export/excel

Download Excel for a delivery batch (admin). Requires session.

**Query parameters:** Same as PDF (`delivery_batch` required).

**Success (200):** Binary XLSX; `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; `Content-Disposition: attachment; filename="tecos-orders-YYYY-MM-DD.xlsx"`.

**Errors:** 400, 401, 404, 500.

---

*Update notes: Initial version; reflects codebase as of 2026-02-24. Optional email and request shape as of 2026-02-27.*
