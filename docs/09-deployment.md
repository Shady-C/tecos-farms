# Deployment and Environment

**Purpose:** Environment variables, local and production deployment steps, CI/CD note, and infrastructure.

**See also:** [README](../README.md), [supabase/README.md](../supabase/README.md), [.env.local.example](../.env.local.example), [docs index](README.md).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL (Settings → API in dashboard). |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Supabase anon/public key. |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Supabase service role key (server-side only; never expose to client). |

Copy from [.env.local.example](../.env.local.example) to `.env.local` and fill in values from the [Supabase](https://supabase.com) project (Settings → API).

---

## Deployment steps

### Local

1. Clone repo and install: `npm install`.
2. Copy `.env.local.example` to `.env.local` and set the three variables above.
3. In Supabase SQL Editor, run migrations in order (see [supabase/README.md](../supabase/README.md)):
   - `supabase/migrations/20260223000001_initial_schema.sql`
   - `supabase/migrations/20260223000002_seed_settings.sql`
4. In Supabase **Authentication → Users**, create one admin user (email + password).
5. Run `npm run dev`. Open [http://localhost:3000/order](http://localhost:3000/order) and [http://localhost:3000/admin](http://localhost:3000/admin); log in at `/admin/login` with the admin user.

### Vercel (production)

1. Push repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), **Add New Project** and import this repo.
3. In **Settings → Environment Variables**, add the same three variables as in `.env.local`.
4. Deploy. Optionally add a custom domain (e.g. `order.tecosfarms.co.tz`) under **Settings → Domains**.

---

## CI/CD

- **Current:** No pipeline in the repo. Vercel builds and deploys on push to the connected branch.
- **Optional:** Add GitHub Actions (or similar) to run `npm run lint` (and later tests) on push/PR.

---

## Infrastructure

- No Infrastructure as Code in the repo. Setup is manual:
  - **Vercel:** One project linked to this repo.
  - **Supabase:** One project; migrations applied manually via SQL Editor in the dashboard.

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
