# User and Support Documentation

**Purpose:** User guides (customer and admin), troubleshooting, and FAQ.

**See also:** [01-project-overview.md](01-project-overview.md), [03-architecture.md](03-architecture.md), [04-api.md](04-api.md), [docs index](README.md).

---

## User guides

### Customers: place an order

1. Open the order page (e.g. `/order` or the link shared by the farm).
2. Enter your **name**, **phone**, **delivery area**, and **kilos** (amount of meat).
3. Check the price per kg and total (shown on the form).
4. Tap **Submit order**.
5. You will see a confirmation message. No account or email is required.

---

### Admins: quick start

1. Go to the admin area (e.g. `/admin`) and open **Admin login** if needed.
2. Sign in with your email and password.
3. **Orders:** View all orders; use the **Batch** and **Payment** filters. Use **Mark paid**, **Unpaid**, **Confirm**, **Delivered** as needed. Use **Export PDF** or **Export Excel** for the selected (or first) batch.
4. **Settings:** Change price per kg, order cutoff day/time, and delivery day; save.

---

## Troubleshooting

| Issue | What to check / do |
|-------|--------------------|
| "Unable to load prices" on order form | Ensure the `settings` table has one row and that `GET /api/settings/public` returns data (e.g. check network tab). Run seed migration if needed. |
| "Unauthorized" on admin pages or admin API | Session expired or missing. Log in again at `/admin/login`. Clear cookies for the site if login loop persists. |
| "Missing delivery_batch query parameter" on export | Choose a delivery batch in the Orders page dropdown first, then use Export PDF or Export Excel. |
| Export returns "No orders for this delivery batch" | Normal if there are no orders for that batch; create or select a batch that has orders. |
| Build fails with @react-pdf/renderer | Ensure [next.config.ts](../next.config.ts) includes `serverExternalPackages: ["@react-pdf/renderer"]`. |

---

## FAQ

| Question | Answer |
|----------|--------|
| Who can place orders? | Anyone with the order link. No account required; orders are identified by phone. |
| How is delivery batch set? | Server computes the next occurrence of the configured delivery day (e.g. next Saturday) when the order is created. See [lib/delivery.ts](../lib/delivery.ts) and [03-architecture.md](03-architecture.md). |
| Where is the service role key used? | Only in API routes on the server (e.g. creating orders, reading/updating orders and settings). It is never sent to the browser. See [03-architecture.md](03-architecture.md) and [09-deployment.md](09-deployment.md). |
| Can customers see their order history? | Not in Phase 1; order history for customers is a Phase 3 goal. See [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md). |

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
