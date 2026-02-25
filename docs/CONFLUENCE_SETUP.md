# Confluence Space Setup — Tecos Farms OMS

**Purpose:** One Confluence space for Tecos Farms where all project documentation lives. Use this guide and the Composer prompt below to publish the contents of the `docs/` folder to Confluence via the Confluence MCP.

---

## Prerequisites

- Confluence MCP server is connected in Cursor (Settings → Features → MCP) and enabled for this workspace.
- You know your Confluence **space key** (e.g. `TECOS`). If you don’t have a space yet, create one in Confluence first: **Space → Create space** (e.g. name: **Tecos Farms**, key: **TECOS**).

---

## Documents to publish

**Published:** All docs are live in Confluence space **SD** (Software Development). Parent page: [Tecos Farms OMS Documentation](https://shafraam.atlassian.net/wiki/spaces/SD/pages/425985/Tecos+Farms+OMS+Documentation). (No TECOS space existed at publish time; you can create one and move pages later if desired.)

| Order | Source file | Confluence page title |
|-------|-------------|------------------------|
| 0 | PROJECT_CONTEXT.md | Project Context |
| 1 | README.md | Documentation Index |
| 2 | 00-mvp-and-roadmap.md | MVP and Roadmap |
| 3 | 01-project-overview.md | Project Overview |
| 4 | 02-requirements.md | Requirements |
| 5 | 03-architecture.md | Architecture and Design |
| 6 | 04-api.md | API Documentation |
| 7 | 05-codebase.md | Codebase Documentation |
| 8 | 06-technical-specs.md | Technical Specifications |
| 9 | 07-project-process.md | Project Process |
| 10 | 08-testing-quality.md | Testing and Quality |
| 11 | 09-deployment.md | Deployment and Environment |
| 12 | 10-user-support.md | User and Support Documentation |
| 13 | 11-standards.md | Standards and Best Practices |

---

## How to run (Composer + Confluence MCP)

1. **Create the Confluence space** (if needed) in Confluence: name **Tecos Farms**, key **TECOS** (or your choice).
2. Open **Cursor Composer** (e.g. Cmd+I) so the Agent can use MCP tools.
3. Paste the prompt below into Composer. Replace `TECOS` with your actual space key if different.
4. When the Agent proposes Confluence MCP tool calls, approve them so it can create/update pages.

---

## Composer prompt (copy and paste)

```
Using the Confluence MCP, set up one Confluence space for Tecos Farms and publish all project documentation there.

1) Space: Use the space with key "TECOS" (or create it if your MCP supports creating spaces). If creation isn't supported, assume the space already exists with key "TECOS".

2) Structure: Create a single parent page in that space titled "Tecos Farms OMS Documentation". Then create child pages under that parent, one per document in the table below. Use the exact page titles in the "Confluence page title" column and use the full content from the corresponding file in this repo's docs/ folder.

Source file → Confluence page title:
- PROJECT_CONTEXT.md → Project Context
- README.md → Documentation Index
- 00-mvp-and-roadmap.md → MVP and Roadmap
- 01-project-overview.md → Project Overview
- 02-requirements.md → Requirements
- 03-architecture.md → Architecture and Design
- 04-api.md → API Documentation
- 05-codebase.md → Codebase Documentation
- 06-technical-specs.md → Technical Specifications
- 07-project-process.md → Project Process
- 08-testing-quality.md → Testing and Quality
- 09-deployment.md → Deployment and Environment
- 10-user-support.md → User and Support Documentation
- 11-standards.md → Standards and Best Practices

3) Content: For each page, read the file from docs/ in this workspace and use that content as the page body. If the Confluence MCP expects a specific format (e.g. Confluence Storage Format or Markdown), convert the Markdown from the file accordingly. Preserve headings, tables, code blocks, and links where possible.

4) Order: Create the parent page first, then create each child page linked to that parent, in the order listed above.

After you're done, reply with the space key, the parent page title, and the list of child page titles so we can open them in Confluence.
```

---

## After the first run

- To **update** a single doc in Confluence: in Composer, say something like: *"Using the Confluence MCP, update the Confluence page 'API Documentation' in space TECOS with the current content from docs/04-api.md in this repo."*
- To **re-sync all docs**: run the same Composer prompt again; the Agent can update existing pages if the MCP supports it, or you can delete and recreate the child pages.

---

*Update notes: Added 2026-02-24 for initial Confluence setup.*
