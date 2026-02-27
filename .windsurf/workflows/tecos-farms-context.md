---
description: Teco's Farms OMS — project context, constraints, and lifecycle
---

# Teco's Farms — Order Management System

Small Tanzania-based business: lean, mobile-first, $0/month target. Replaces WhatsApp-to-spreadsheet ordering.

**Stack:** Next.js (App Router), Tailwind, Supabase, Vercel. Admin auth via Supabase only; no customer auth. PDF with `@react-pdf/renderer` (server-side).

**Key constraints:** Fast on slow mobile networks; minimal JS on public form; snapshot `price_per_kg` and `total_price` at order time; admin APIs require Supabase session and use service-role client.

**Full context:** [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) — vision, architecture, schema, phases (MVP → refinements → growth).

## Phase Awareness

Check the **Current Phase** field at the top of `docs/PROJECT_CONTEXT.md` before implementing features. Phase 1 (MVP) is complete. Only build features in the current phase scope unless explicitly overridden.

## Change Tracking

If your implementation deviates from the documented plan, follow the `/track-change` workflow: create an ADR in `docs/decisions/`, update `CHANGELOG.md`, and update affected docs. See also `.windsurf/workflows/project-lifecycle.md`.
