# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Phase 1 (in review)

### Added

- Public order form (mobile-first) at `/` (home); `/order` redirects to `/`.
- Optional customer **email** on orders: `orders.email` nullable; collected on form and returned in GET/PATCH.
- Order form: country dial-code selector (default +255), optional email field, “Place another order” after success; phone sent as E.164 (`data/countries.json`).
- Admin dashboard: orders list with filters (delivery batch, payment status)
- Order management: mark paid/unpaid, confirm, delivered, notes
- Settings page: price per kg, order cutoff day/time, delivery day
- PDF export by delivery batch (grouped by area)
- Excel export by delivery batch
- Admin authentication via Supabase (email/password)
- Middleware protection for `/admin/*` routes

### Decisions

- **ADR-0003:** Optional customer email on orders; order form served on home page (`/`), `/order` redirects to `/`.
