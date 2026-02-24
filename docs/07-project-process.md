# Project Process

**Purpose:** Changelog, milestones, decision log (ADRs), and placeholders for issue tracking and meeting summaries.

**See also:** [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md), [03-architecture.md](03-architecture.md), [docs index](README.md).

---

## Changelog / version history

Changelog is maintained in this section (or can be moved to a root `CHANGELOG.md` when the team adopts it).

### Initial release (Phase 1 MVP)

- Public order form (mobile-first) at `/order`.
- Admin dashboard: orders list with filters (delivery batch, payment status); mark paid/unpaid, confirm, delivered; notes.
- Settings: price per kg, order cutoff day/time, delivery day.
- PDF export by delivery batch (grouped by area).
- Excel export by delivery batch.
- Admin auth (Supabase email/password); middleware protection for `/admin/*`.

---

## Issue log and milestones

- **Issue tracking:** Use GitHub Issues (or your preferred tool) for bugs and features. Link issues to milestones if applicable.
- **Current milestones:** Phase 1 (MVP) — done. Phase 2 (refinements) and Phase 3 (growth) — see [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md) and [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

---

## Decision log (Architectural Decision Records)

There is no formal `docs/adr/` folder yet. Key decisions are recorded in:

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) — vision, tech choices, design decisions.
- [03-architecture.md](03-architecture.md) — design decisions and rationale.

**Optional:** Add `docs/adr/` and an initial ADR summarizing: no customer auth; price snapshot at order time; service role used only in API routes server-side.

---

## Meeting summaries

Add when relevant (e.g. kickoff, release, or major scope decisions).

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
