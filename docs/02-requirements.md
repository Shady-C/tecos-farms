# Requirements

**Purpose:** Capture functional and non-functional requirements for the OMS.

**See also:** [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md), [04-api.md](04-api.md), [06-technical-specs.md](06-technical-specs.md), [docs index](README.md).

---

## Functional requirements

### Public (customers)

- Submit an order with: customer name, phone, delivery area, kilos (positive number).
- See current price per kg and calculated total before submitting.
- Receive a confirmation message after successful submission (no account or email).

### Admin

- Log in with email and password (Supabase Auth).
- List all orders, with optional filters: delivery batch, payment status.
- Update an order: payment status (unpaid, prepaid, paid), payment method (cash, mobile_money), order status (pending, confirmed, delivered), notes.
- Read and update settings: price_per_kg, order_cutoff_day, order_cutoff_time, delivery_day.
- Export PDF for a given delivery batch (orders grouped by area).
- Export Excel for a given delivery batch.

### Auth

- Admin-only authentication; no customer accounts. All admin routes and admin API routes require a valid session.

---

## Non-functional requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Mobile-first; minimal client-side JS on the order form; SSR for fast first load on slow networks (e.g. 3G). |
| **Security** | Service role key used only server-side (API routes). RLS blocks direct DB access for anon users on orders and settings. Admin APIs require session. |
| **Limits** | Target $0/month on free tiers (Vercel, Supabase). Single row for settings. |
| **Availability** | Best effort via Vercel and Supabase SLAs; no formal SLA defined for Phase 1. |

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
