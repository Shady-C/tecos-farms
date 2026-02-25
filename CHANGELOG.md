# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Phase 1 (in review)

### Added

- Public order form (mobile-first) at `/order`
- Admin dashboard: orders list with filters (delivery batch, payment status)
- Order management: mark paid/unpaid, confirm, delivered, notes
- Settings page: price per kg, order cutoff day/time, delivery day
- PDF export by delivery batch (grouped by area)
- Excel export by delivery batch
- Admin authentication via Supabase (email/password)
- Middleware protection for `/admin/*` routes
