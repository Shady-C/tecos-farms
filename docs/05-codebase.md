# Codebase Documentation

**Purpose:** Module map and responsibilities; dependencies; pointers to key files.

**See also:** [04-api.md](04-api.md), [06-technical-specs.md](06-technical-specs.md), [docs index](README.md).

---

## Directory and module structure

### app/

Next.js App Router: each route has a `page.tsx` and/or API `route.ts`.

| Path | Responsibility |
|------|----------------|
| [app/page.tsx](../app/page.tsx) | Home: link to `/order`. |
| [app/order/page.tsx](../app/order/page.tsx) | Public order form: fetches `GET /api/settings/public`, submits `POST /api/orders`; shows confirmation on success. |
| [app/admin/layout.tsx](../app/admin/layout.tsx) | Admin layout: session check, nav (Orders, Settings), logout. |
| [app/admin/login/page.tsx](../app/admin/login/page.tsx) | Admin login: Supabase `signInWithPassword`; redirect to `/admin/orders` on success. |
| [app/admin/orders/page.tsx](../app/admin/orders/page.tsx) | Orders list: filters (delivery_batch, payment_status), table, Mark paid/Unpaid/Confirm/Delivered; links to PDF/Excel export. |
| [app/admin/settings/page.tsx](../app/admin/settings/page.tsx) | Settings form: GET/PUT `/api/settings` (price_per_kg, cutoff, delivery day). |
| [app/admin/AdminLogout.tsx](../app/admin/AdminLogout.tsx) | Logout button (Supabase signOut). |
| [app/api/orders/route.ts](../app/api/orders/route.ts) | POST (create order, public), GET (list orders, admin). |
| [app/api/orders/[id]/route.ts](../app/api/orders/[id]/route.ts) | PATCH order (admin). |
| [app/api/settings/route.ts](../app/api/settings/route.ts) | GET/PUT settings (admin). |
| [app/api/settings/public/route.ts](../app/api/settings/public/route.ts) | GET public price/delivery info (no auth). |
| [app/api/export/pdf/route.ts](../app/api/export/pdf/route.ts) | GET PDF by delivery_batch (admin). |
| [app/api/export/excel/route.ts](../app/api/export/excel/route.ts) | GET Excel by delivery_batch (admin). |

### lib/

| File | Responsibility |
|------|----------------|
| [lib/supabase/server.ts](../lib/supabase/server.ts) | `createClient()` — server client with cookies (session). `createServiceRoleClient()` — bypasses RLS; server-only; use in API after auth check. |
| [lib/supabase/auth.ts](../lib/supabase/auth.ts) | `getSession()` — returns current Supabase session in API routes (uses cookies). |
| [lib/supabase/client.ts](../lib/supabase/client.ts) | Browser Supabase client (e.g. login page). |
| [lib/delivery.ts](../lib/delivery.ts) | `getNextDeliveryBatch(deliveryDay: string): string` — next occurrence of that weekday as YYYY-MM-DD. |

### components/

| File | Responsibility |
|------|----------------|
| [components/FarmOrderSheet.tsx](../components/FarmOrderSheet.tsx) | PDF document structure for farm order sheet (by area); used by `app/api/export/pdf/route.ts` with @react-pdf/renderer. |

### types/

| File | Responsibility |
|------|----------------|
| [types/index.ts](../types/index.ts) | Shared types: `Order`, `Settings`, `PaymentStatus`, `PaymentMethod`, `OrderStatus`. |

### Root

| File | Responsibility |
|------|----------------|
| [middleware.ts](../middleware.ts) | Protects `/admin/*`: redirect to `/admin/login` if no session; redirect to `/admin/orders` if logged in and on login page. |

---

## Dependencies (package.json)

| Package | Role |
|---------|------|
| next | App Router, API routes, SSR. |
| react, react-dom | UI. |
| @supabase/supabase-js | Supabase client. |
| @supabase/ssr | Server-side session (cookies) for Next.js. |
| @react-pdf/renderer | Server-side PDF generation in export API. |
| exceljs | Server-side Excel generation in export API. |
| tailwindcss, @tailwindcss/postcss, postcss | Styling. |
| typescript, eslint, eslint-config-next | Type checking and linting. |

---

## In-code documentation (recommended)

Consider adding JSDoc to:

- `getNextDeliveryBatch` in [lib/delivery.ts](../lib/delivery.ts) — summary and `@param` / `@returns`.
- `createServiceRoleClient` in [lib/supabase/server.ts](../lib/supabase/server.ts) — note server-only, never expose to browser.
- API route handlers — short summary of method and auth.

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
