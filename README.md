# Teco's Farms — Order Management System

A lean, mobile-first order management system for Teco's Farms (Tanzania). Replaces the manual WhatsApp-to-spreadsheet workflow with a public order form and an admin dashboard.

**Stack:** Next.js (App Router), Tailwind, Supabase, Vercel. Target cost: **$0/month** on free tiers.

## Project context

Full vision, architecture, schema, and phases are in **[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)**.

## Status

- **Phase 1 (MVP):** Implemented — public order form, admin dashboard, PDF export, settings.
- **Phase 2–3:** Cutoff logic, repeat customers, shareable assets, notifications; later, M-Pesa and analytics (see `docs/PROJECT_CONTEXT.md`).

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd "tecos farms"
npm install
```

### 2. Environment variables

Copy the example env file and fill in your Supabase values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (Settings → API).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key.
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (Settings → API; keep secret).

### 3. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the migrations in order (see [supabase/README.md](supabase/README.md)):
   - `supabase/migrations/20260223000001_initial_schema.sql`
   - `supabase/migrations/20260223000002_seed_settings.sql`
3. In **Authentication → Users**, add one admin user (email + password). Use this to log in at `/admin/login`.

### 4. Run locally

```bash
npm run dev
```

- Public order form: [http://localhost:3000/order](http://localhost:3000/order)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (log in with the user you created).

---

## Deploy (Vercel)

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), **Add New Project** and import this repo.
3. In **Settings → Environment Variables**, add the same three variables as in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Optionally add a custom domain (e.g. `order.tecosfarms.co.tz`) in **Settings → Domains**.

---

## Scripts

- `npm run dev` — start dev server (Turbopack).
- `npm run build` — production build.
- `npm run start` — start production server.
- `npm run lint` — run ESLint.
