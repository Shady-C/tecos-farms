# MVP Stages and Future Goals

**Purpose:** Single place for phase breakdown, MVP scope, and future roadmap. Use when prioritizing work or onboarding stakeholders.

**Audience:** Product, developers, stakeholders.

**See also:** [Documentation index](README.md), [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [01-project-overview.md](01-project-overview.md), [02-requirements.md](02-requirements.md).

---

## Phase 1 — MVP (Done)

**Scope (Week 1–2):** Replace WhatsApp-to-spreadsheet with a minimal, mobile-first OMS.

| Delivered | Status |
|-----------|--------|
| Public order form (mobile-first) | Done |
| Admin dashboard: view orders | Done |
| Admin: filter by delivery batch, payment status | Done |
| Admin: mark paid/unpaid, confirm, delivered | Done |
| PDF export by delivery batch (grouped by area) | Done |
| Excel export by delivery batch | Done |
| Basic settings (price_per_kg, delivery day, cutoff day/time) | Done |
| Price snapshot at order time | Done |
| Admin auth (Supabase email/password) | Done |

**Outcome:** Business can share an order link, collect orders in one place, and export sheets for the farm team.

---

## Phase 2 — Refinements (Planned)

**Scope (Week 3–4):** Improve operations and customer experience without new infrastructure.

| Goal | Status |
|------|--------|
| Order cutoff logic (e.g. orders close Wednesday midnight for Saturday delivery) | Planned |
| Repeat customer auto-fill (phone lookup from `customers` table) | Planned |
| Shareable image ("Orders open — link in bio") | Planned |
| Order confirmation page with M-Pesa/Tigo Pesa instructions (text only) | Planned |
| SMS or WhatsApp: copy-paste or click-to-chat link (no API) | Planned |

---

## Phase 3 — Growth (Planned)

**Scope:** When the business scales; may require paid tiers or new services.

| Goal | Status |
|------|--------|
| Mobile money payment verification (M-Pesa API) | Planned |
| Customer order history | Planned |
| Demand analytics (areas, weekly trends) | Planned |

---

## Future goals summary

| Phase | Focus | Status |
|-------|--------|--------|
| Phase 1 | MVP: form, admin, export, settings | Done |
| Phase 2 | Cutoff, repeat customers, shareable assets, payment instructions | Planned |
| Phase 3 | M-Pesa verification, history, analytics | Planned |

---

*Update notes: Update this doc when a phase is completed or goals change. Initial version; reflects codebase as of 2026-02-24.*
