# ADR-0001: No Customer Authentication

**Date:** 2026-02-24
**Status:** Accepted
**Jira:** N/A

## Context

The order form is shared via WhatsApp links to customers. Requiring login or account creation adds friction that would reduce order completion rates, especially on mobile in Tanzania where data is expensive and users expect quick interactions.

## Decision

The public order form is anonymous. Customers are identified by phone number only. Authentication is restricted to admin users via Supabase Auth (email/password).

## Alternatives Considered

- **Phone OTP auth:** Adds cost (SMS gateway), complexity, and friction. Not justified for a simple order form.
- **WhatsApp login:** No standard API for this; would require Business API integration which is Phase 3+ scope.
- **Guest checkout with optional account:** Over-engineered for current scale.

## Consequences

- Duplicate orders from the same phone number are possible and must be handled manually by admin.
- No customer order history until Phase 2+ introduces the `customers` table.
- Price and order data are not tied to an authenticated identity, so there's no self-service order tracking.
