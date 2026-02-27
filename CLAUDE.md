# Teco's Farms — Order Management System

Small Tanzania-based business: lean, mobile-first, $0/month target. Replaces WhatsApp-to-spreadsheet ordering.

**Stack:** Next.js (App Router), Tailwind, Supabase, Vercel. Admin auth via Supabase only; no customer auth. PDF with `@react-pdf/renderer` (server-side).

**Key constraints:** Fast on slow mobile networks; minimal JS on public form; snapshot `price_per_kg` and `total_price` at order time; admin APIs require Supabase session and use service-role client.

**Full context:** `docs/PROJECT_CONTEXT.md` — vision, architecture, schema, phases (MVP → refinements → growth).

## Phase Awareness

Check the **Current Phase** field at the top of `docs/PROJECT_CONTEXT.md` before implementing features. Only build features in the current phase scope unless explicitly overridden.

## Change Tracking

If your implementation deviates from the documented plan: create an ADR in `docs/decisions/`, update `CHANGELOG.md`, and update affected docs. Follow the "Track Change" workflow in `~/.claude/CLAUDE.md`.

## Key Files

| File | Purpose |
|------|---------|
| `docs/PROJECT_CONTEXT.md` | Source of truth: vision, stack, schema, phase state |
| `docs/00` through `docs/11` | Full documentation suite |
| `docs/decisions/` | Architecture Decision Records |
| `CHANGELOG.md` | What shipped per phase |
| `docs/WORKFLOW_GUIDE.md` | Skills, conventions, quick commands |

## Confluence

Space: **SD**. Parent page: "Tecos Farms OMS Documentation". Use Atlassian MCP to sync. `docs/` is always the source of truth.

## Atlassian MCP

CloudId: `7193d821-f263-49ed-9504-4bf122b0985d`. Confluence spaceId: `196612`. Parent pageId: `425985`.
