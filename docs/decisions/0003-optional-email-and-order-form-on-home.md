# ADR-0003: Optional Customer Email and Order Form on Home Page

**Date:** 2026-02-27
**Status:** Accepted
**Jira:** (Phase 1 refinement)

## Context

- **Email:** Customers may want to receive order confirmations or follow-up by email; the original MVP only captured name, phone, and area. Adding optional email improves contact options without requiring auth.
- **Form location:** The public order flow lived at `/order` with a separate home page at `/` linking to it. Consolidating the form onto the home page reduces navigation (one less click from a shared link) and keeps the primary entry point (e.g. WhatsApp) as the place to order.

## Decision

1. **Optional `email` on orders**
   - Add nullable `email` column to `orders` (migration `20260227000001_add_email_to_orders.sql`).
   - `POST /api/orders` accepts optional `email`; store trimmed value or null. GET and PATCH responses include `email`.
   - Public order form includes an optional "Email" field; no validation beyond optional and trim.

2. **Order form on home page**
   - Serve the public order form at `/` (home). Remove the standalone `/order` page content; `/order` redirects to `/` so existing links continue to work.
   - Form gains a country dial-code selector for phone (default +255), with phone submitted as full number (e.g. E.164). Data source: `data/countries.json`.
   - After successful submit, show "Place another order" to reset and submit again instead of "Back to home".

## Alternatives Considered

- **Email required:** Rejected so existing flow (phone-only) remains valid and adoption is easier.
- **Keep form at `/order`:** Rejected in favour of a single landing page that is both brand and order entry, reducing friction for shared links.
- **Separate “Order” CTA that scrolls to form:** Possible future refinement; for now a single page with form below the header is sufficient.

## Consequences

- **Schema:** All new orders can have `email` null; existing rows remain valid. Admin list/detail and exports include `email` (null for pre-migration or omitted submissions).
- **API:** Request/response shapes documented in `docs/04-api.md` and `docs/06-technical-specs.md`; types in `types/index.ts` include `email: string | null`.
- **Routing:** `/order` is a redirect; any bookmarks or links to `/order` still work.
- **Data:** `data/countries.json` is part of the repo for the dial-code dropdown; no backend dependency.
