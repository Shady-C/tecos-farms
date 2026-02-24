# Testing and Quality

**Purpose:** Test plan, test cases, QA strategy, and acceptance criteria. Documents current state (no automated tests) and recommended coverage.

**See also:** [02-requirements.md](02-requirements.md), [04-api.md](04-api.md), [docs index](README.md).

---

## Current state

- **No test framework** in [package.json](../package.json); no test runner or test files in the repo.
- Phase 1 MVP is validated by **manual testing**.

---

## Test plan

### Unit tests (recommended)

| Target | Description |
|--------|-------------|
| `getNextDeliveryBatch` in [lib/delivery.ts](../lib/delivery.ts) | Given a weekday name (e.g. "saturday"), returns the next occurrence as YYYY-MM-DD. Edge cases: today is that day (next week), invalid day fallback. |

### API tests (recommended)

| Endpoint | Scenarios |
|----------|-----------|
| POST /api/orders | Missing/invalid fields → 400; valid body → 200 with id, total_price, delivery_batch; settings failure → 500. |
| GET /api/orders | No session → 401; with session → 200 array; optional query params (delivery_batch, payment_status). |
| PATCH /api/orders/[id] | No session → 401; no fields → 400; invalid id / not found → 404; valid partial update → 200. |
| GET /api/settings/public | 200 with price_per_kg, delivery_day, order_cutoff_day (no auth). |
| GET /api/export/pdf, GET /api/export/excel | No session → 401; missing delivery_batch → 400; no orders for batch → 404. |

### E2E (optional)

- Customer: Open /order, fill form, submit → confirmation message.
- Admin: Log in at /admin/login, open orders, filter, mark one paid, export PDF for a batch.

---

## Test cases (examples)

| Case | Input / action | Expected |
|------|----------------|----------|
| POST order, missing phone | Body without phone or empty phone | 400, error message |
| POST order, invalid kilos | kilos: 0 or negative | 400 |
| POST order, valid | Valid customer_name, phone, area, kilos | 200, JSON with id, total_price, delivery_batch |
| GET orders, no cookie | Request without session | 401 |
| GET orders, with session | Request with valid session cookie | 200, array of orders |
| PATCH order, not found | Valid session, wrong UUID | 404 |

---

## QA strategy and acceptance criteria

- **Phase 1:** Manual QA for each release: place order (public), log in (admin), list/filter/update orders, change settings, export PDF and Excel.
- **Acceptance criteria (MVP):**
  - Customer can submit an order and see a confirmation.
  - Admin can list orders, filter by batch and payment status, and update payment/order status.
  - Admin can update settings and see new price on next order.
  - Admin can download PDF and Excel for a delivery batch with correct data grouped (PDF by area).

---

## Coverage

No coverage reports yet. When tests are introduced, add a script (e.g. Vitest or Jest with coverage) and document in this section or in [09-deployment.md](09-deployment.md) if run in CI.

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
