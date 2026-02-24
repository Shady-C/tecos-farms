# Standards and Best Practices

**Purpose:** Coding standards, style and naming conventions, and how to maintain documentation.

**See also:** [05-codebase.md](05-codebase.md), [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [docs index](README.md).

---

## Coding standards

- **TypeScript:** Use strict typing; types live in [types/index.ts](../types/index.ts) for shared shapes.
- **Next.js:** Follow App Router conventions; API routes in `app/api/**/route.ts`; use Server Components where possible, `"use client"` only when needed.
- **Linting:** Run `npm run lint` (ESLint with eslint-config-next). Fix lint errors before committing.

---

## Style and naming

| Area | Convention | Example |
|------|------------|---------|
| React components | PascalCase; file name matches component | FarmOrderSheet.tsx |
| API routes | Lowercase path segments; REST-like | /api/orders, /api/settings/public |
| Shared types | In types/index.ts; interfaces PascalCase | Order, Settings |
| Database | snake_case for tables and columns | orders, price_per_kg |
| Enums (DB and app) | lowercase values | unpaid, prepaid, paid |

---

## Documentation maintenance

- **Vision, schema, phases:** Update [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) and [00-mvp-and-roadmap.md](00-mvp-and-roadmap.md) when phases or goals change.
- **New or changed API:** Update [04-api.md](04-api.md) and [06-technical-specs.md](06-technical-specs.md).
- **New env var or deploy step:** Update [09-deployment.md](09-deployment.md) and root [README.md](../README.md).
- **New module or major refactor:** Update [05-codebase.md](05-codebase.md).
- **Doc-only or version bump:** Note in [docs/README.md](README.md) (Document version) or in the relevant doc’s "Update notes" at the bottom.

**Single source of truth:** PROJECT_CONTEXT for vision, schema, and phases; this documentation set for the full software design (requirements, architecture, API, codebase, process, testing, deployment, user/support, standards).

---

*Update notes: Initial version; reflects codebase as of 2026-02-24.*
