# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migrations in order:
   - `migrations/20260223000001_initial_schema.sql`
   - `migrations/20260223000002_seed_settings.sql`
3. In **Authentication → Users**, create one admin user (email + password). Use this to log in at `/admin/login`.
4. Copy **Project URL** and **anon key** to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy **service_role** key as `SUPABASE_SERVICE_ROLE_KEY` (Settings → API).

Note: The `orders` table has a policy that blocks all direct access; the app uses the service role in API routes to insert and manage orders.
