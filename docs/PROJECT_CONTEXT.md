# Teco's Farms — Project Context

This document is the single source of truth for the project's vision, constraints, architecture, and roadmap. Use it to onboard or to keep AI and future work aligned.

---

## What This Is

**Teco's Farms** is a small Tanzania-based business. This repo is their **Order Management System (OMS)** — a lean, mobile-first web app that replaces the manual WhatsApp-to-spreadsheet workflow.

### Goals

- **Lean**: Minimal code, minimal cost ($0/month on free tiers until scale).
- **Fast on mobile**: Optimized for slow networks (e.g. 3G) and touch devices in Tanzania.
- **Cheap to run**: No dedicated backend server; Supabase + Vercel free tiers.

### Why Not Alternatives

- **Native app**: Customers won’t download an app to order; a link from WhatsApp is frictionless.
- **Google Forms**: No admin dashboard, payment tracking, auto-pricing, branded experience, or PDF export.
- **Supabase over Firebase**: PostgreSQL is better for querying (filter by area, date, payment status); generous free tier.
- **Next.js**: Single codebase for public form + admin dashboard; SSR for fast first load on slow networks.

---

## Tech Stack

| Layer        | Choice              | Why |
|-------------|---------------------|-----|
| Frontend    | Next.js (App Router)| One app for form + admin; SSR for fast load. |
| Styling     | Tailwind CSS        | Fast to build, responsive. |
| Backend/API | Next.js API Routes  | No separate backend. |
| Database    | Supabase (Postgres) | Free tier, hosted, auth, optional real-time. |
| Auth        | Supabase Auth       | Admin only (email/password). No customer auth. |
| PDF         | @react-pdf/renderer | Farm order sheet (grouped by area). |
| Hosting     | Vercel              | Free tier, CDN, zero DevOps. |
| Domain      | e.g. order.tecosfarms.co.tz | Easy to share on WhatsApp/Instagram. |

**Target running cost: $0/month** on free tiers until the business scales.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   VERCEL (Hosting)               │
│  ┌─────────────────┐    ┌──────────────────────┐ │
│  │  Public Order    │    │   Admin Dashboard    │ │
│  │  Form /order     │    │   /admin/* (auth)    │ │
│  └────────┬────────┘    └──────────┬───────────┘ │
│           │                         │              │
│  ┌────────▼─────────────────────────▼───────────┐ │
│  │         Next.js API Routes                    │ │
│  │  POST/GET/PATCH orders, GET/PUT settings,     │ │
│  │  GET export/pdf                               │ │
│  └────────────────────┬──────────────────────────┘ │
└───────────────────────┼────────────────────────────┘
                        ▼
              ┌──────────────────┐
              │    SUPABASE       │
              │  orders, settings │
              │  Auth (admin)     │
              └──────────────────┘
```

- **Public**: Order form submits to `POST /api/orders`. Price comes from `GET /api/settings/public`.
- **Admin**: All other API routes and `/admin/*` require Supabase session. Use service-role server client for DB writes.

---

## Database Schema

### orders

| Column           | Type     | Notes |
|------------------|----------|--------|
| id               | uuid, PK | |
| customer_name    | text     | |
| phone            | text     | |
| area             | text     | Delivery zone |
| kilos            | decimal  | |
| price_per_kg     | decimal  | Snapshot at order time |
| total_price      | decimal  | |
| payment_status   | enum     | unpaid, prepaid, paid |
| payment_method   | enum     | cash, mobile_money, null |
| order_status     | enum     | pending, confirmed, delivered |
| delivery_batch   | text     | e.g. "2026-02-28" for grouping |
| notes            | text     | Optional, for farm team |
| created_at       | timestamptz | |

### settings (single row)

| Column            | Type    | Notes |
|-------------------|---------|--------|
| id                | uuid PK | |
| price_per_kg      | decimal | |
| order_cutoff_day  | text    | e.g. "wednesday" |
| order_cutoff_time | time    | |
| delivery_day      | text    | e.g. "saturday" |

### customers (Phase 2+)

| Column       | Type   | Notes |
|--------------|--------|--------|
| id           | uuid PK | |
| name         | text   | |
| phone        | text   | unique |
| area         | text   | |
| total_orders | int    | |
| created_at   | timestamptz | |

---

## Phases

### Phase 1 — MVP (Week 1–2)

- Public order form (mobile-first).
- Admin dashboard: view/manage orders, mark paid/unpaid.
- PDF export for farm team (by delivery batch, grouped by area).
- Basic price configuration (settings).
- Replace WhatsApp-to-spreadsheet immediately.

### Phase 2 — Refinements (Week 3–4)

- Order cutoff logic (e.g. orders close Wednesday midnight for Saturday delivery).
- Repeat customer auto-fill (phone lookup from `customers`).
- Shareable image (“Orders open — link in bio”).
- Order confirmation page with M-Pesa/Tigo Pesa instructions (text only).
- SMS or WhatsApp: copy-paste or click-to-chat link (no API).

### Phase 3 — If the business grows

- Mobile money payment verification (M-Pesa API).
- Customer order history.
- Demand analytics (areas, weekly trends).

---

## Key Design Decisions

1. **No customer auth** — Order form is anonymous; identify by phone.
2. **Snapshot price at order time** — `price_per_kg` and `total_price` stored per order; no retroactive change.
3. **Admin auth only** — Supabase Auth; one or few admin users (create in Dashboard or script).
4. **Public order submit** — Via API route with server-side Supabase (service role); validate and set `delivery_batch` and price snapshot there.
5. **PDF server-side only** — Use `@react-pdf/renderer` in API route; no heavy PDF lib on client.
6. **Mobile-first** — Touch-friendly, minimal JS on form, system or one web font.

---

## Environment

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-side Supabase service role key for admin/order-write operations (e.g. in API routes that create orders or need to bypass RLS).

---

## References

- Plan (implementation steps): see `.cursor/plans/` or project plan file if present.
- Cursor rule for this repo: `.cursor/rules/tecos-farms-context.mdc`.
