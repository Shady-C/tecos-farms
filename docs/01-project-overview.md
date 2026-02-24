# Project Overview

**Purpose:** Describe what the system is and why it exists.

**See also:** [README](../README.md), [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [docs index](README.md).

---

## What the project does

**Teco's Farms** is a small Tanzania-based business. This repository is their **Order Management System (OMS)**—a lean, mobile-first web app that replaces the manual **WhatsApp-to-spreadsheet** workflow. Customers place orders via a shared link; admins view and manage orders in a dashboard and export PDF or Excel for the farm team.

---

## Core features and functionality

- **Public order form** — Mobile-first form at `/order`: name, phone, delivery area, kilos. Price and total are calculated from current settings; no customer account.
- **Admin dashboard** — View and filter orders by delivery batch and payment status; mark orders paid/unpaid, confirm, or delivered; optional notes.
- **Settings** — Single global configuration: price per kg, order cutoff day/time, delivery day.
- **PDF export** — Farm order sheet by delivery batch, grouped by area (for printing or sharing).
- **Excel export** — Orders by delivery batch in spreadsheet format.
- **Price snapshot** — Each order stores `price_per_kg` and `total_price` at order time so historical orders are not affected by future price changes.

---

## Business goals and user problems

| Goal | How the system addresses it |
|------|-----------------------------|
| **Lean / $0/month** | Free tiers: Vercel + Supabase; no dedicated backend server. |
| **Fast on mobile** | Optimized for slow networks (e.g. 3G); minimal JS on the form; SSR for fast first load. |
| **Replace manual process** | Single order link (e.g. from WhatsApp/Instagram); orders in one place; export for farm team. |
| **No app download** | Web-only; link from WhatsApp is frictionless for customers. |

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
