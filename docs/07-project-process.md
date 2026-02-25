# Project Process

**Purpose:** Changelog, milestones, decision log (ADRs), and placeholders for issue tracking and meeting summaries.

**See also:** [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md), [03-architecture.md](03-architecture.md), [docs index](README.md).

---

## Changelog

The full changelog is maintained at [CHANGELOG.md](../CHANGELOG.md) in the project root. It follows the [Keep a Changelog](https://keepachangelog.com/) format and is organized by phase.

---

## Issue log and milestones

- **Issue tracking:** Use GitHub Issues (or your preferred tool) for bugs and features. Link issues to milestones if applicable.
- **Current milestones:** Phase 1 (MVP) — done. Phase 2 (refinements) and Phase 3 (growth) — see [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md) and [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

---

## Decision Log (Architecture Decision Records)

ADRs are stored in `docs/decisions/` as numbered markdown files. Each records the context, decision, alternatives considered, and consequences.

| ADR | Title | Status |
|-----|-------|--------|
| [0001](decisions/0001-no-customer-auth.md) | No Customer Authentication | Accepted |
| [0002](decisions/0002-price-snapshot-at-order-time.md) | Snapshot Price at Order Time | Accepted |

New ADRs are created whenever a decision deviates from the documented plan. See [decisions/_template.md](decisions/_template.md) for the format.

---

## Meeting summaries

Add when relevant (e.g. kickoff, release, or major scope decisions).

---

## Phase 1 Retrospective — 2026-02-24

### What was delivered

- Public order form (mobile-first) at `/order`
- Admin dashboard: orders list with filters (delivery batch, payment status)
- Order management: mark paid/unpaid, confirm, delivered, notes
- Settings page: price per kg, order cutoff day/time, delivery day
- PDF export by delivery batch (grouped by area)
- Excel export by delivery batch
- Admin authentication via Supabase (email/password)
- Middleware protection for `/admin/*` routes
- Full documentation suite (14 docs) published to Confluence

### Decisions made (ADRs)

- [ADR-0001](decisions/0001-no-customer-auth.md): No customer authentication
- [ADR-0002](decisions/0002-price-snapshot-at-order-time.md): Snapshot price at order time

---

*Update notes: Updated 2026-02-24; added ADR system, changelog reference, Phase 1 retrospective.*
