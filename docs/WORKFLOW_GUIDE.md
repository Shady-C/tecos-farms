# Project Workflow Guide

Quick reference for the development lifecycle, skills, and conventions used across projects.

---

## The Lifecycle at a Glance

```
1. PLAN  ──>  2. DOCUMENT  ──>  3. BACKLOG  ──>  4. BUILD  ──>  5. REVIEW
   │              │                  │                │              │
   │  Agree on    │  Write docs      │  Jira Epic +   │  Feature by  │  Phase done?
   │  scope,      │  as source of    │  Stories from   │  feature,    │  Retrospective,
   │  stack,      │  truth for the   │  the docs       │  track any   │  advance phase,
   │  phases      │  current phase   │                 │  deviations  │  sync Confluence
   │              │                  │                 │  with ADRs   │
   └──────────────┴──────────────────┴─────────────────┴──────────────┘
                              ↑ You are here (Phase 1 — in review)
```

---

## Skills Reference

These are global skills installed at `~/.cursor/skills/`. The agent knows about them automatically. You can trigger them by saying the phrases listed below, or the agent may suggest them at the right moment.

### 1. `project-kickoff`

**What it does:** Bootstraps a brand new project from zero — walks through planning, generates the full `docs/` suite, sets up change tracking (ADRs + CHANGELOG), creates Cursor rules, and publishes everything to Confluence.

**When to use it:**
- Starting a completely new project
- "Start a new project" / "Kickoff" / "Bootstrap this project"

**You probably won't need this for Teco's Farms** since the project is already bootstrapped. It's for your next project.

---

### 2. `track-change`

**What it does:** Creates a numbered Architecture Decision Record (ADR) in `docs/decisions/`, updates `CHANGELOG.md`, updates any affected documentation, and offers to sync to Confluence.

**When to use it:**
- You or the agent change the tech stack, schema, API design, or approach
- A requirement is added, dropped, or modified
- You want to record *why* a decision was made

**How to trigger:**
- "Log this decision"
- "Create an ADR for [description]"
- "Track this change"
- The agent may also trigger it automatically when it detects a deviation

**Output:** `docs/decisions/NNNN-short-title.md`

---

### 3. `create-phase-backlog`

**What it does:** Reads your project documentation and creates a Jira Epic with Stories for the current phase. Each story gets acceptance criteria pulled from the docs.

**When to use it:**
- Phase documentation is reviewed and approved
- You're ready to start building and want stories in Jira

**How to trigger:**
- "Create the backlog"
- "Create stories for Phase 1"
- "Set up the Jira epic"

**Output:** 1 Epic + N Stories in Jira, phase state updated in `PROJECT_CONTEXT.md`

---

### 4. `sync-to-confluence`

**What it does:** Publishes or updates all `docs/` files, the CHANGELOG, and ADRs to your Confluence space. Creates new pages or updates existing ones.

**When to use it:**
- After significant doc changes
- After creating ADRs
- After completing a phase
- Anytime you want Confluence to match your local docs

**How to trigger:**
- "Sync docs to Confluence"
- "Publish to Confluence"
- "Update Confluence"
- "Sync just the API docs to Confluence" (selective sync)

---

### 5. `phase-complete`

**What it does:** Wraps up a finished phase — verifies all Jira stories are done, finalizes the CHANGELOG, writes a retrospective in `07-project-process.md`, advances the phase pointer, updates docs for the next phase scope, and syncs to Confluence.

**When to use it:**
- All stories in a phase are done and reviewed
- You're ready to move to the next phase

**How to trigger:**
- "Phase 1 is done"
- "Wrap up this phase"
- "Complete the phase"

---

## Key Files and Conventions

| File / Folder | Purpose | Source of truth? |
|--------------|---------|:---:|
| `docs/PROJECT_CONTEXT.md` | Vision, stack, schema, phases, **current phase state** | Yes |
| `docs/00` through `docs/11` | Full documentation suite | Yes |
| `docs/decisions/` | Architecture Decision Records (ADRs) | Yes |
| `docs/decisions/_template.md` | Template for new ADRs | — |
| `CHANGELOG.md` | What shipped, organized by phase | Yes |
| `.cursor/rules/project-lifecycle.mdc` | Agent behavior: phase discipline, change tracking, commit format | — |
| `.cursor/rules/tecos-farms-context.mdc` | Project-specific agent context | — |

**Rule:** `docs/` is always the source of truth. Confluence is a publish target — never edit Confluence directly.

---

## Commit Message Format

```
type(scope): description [JIRA-KEY]
```

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, config, tooling |

Example: `feat(orders): add delivery batch filter [TECOS-5]`

---

## Phase State Reference

The top of `docs/PROJECT_CONTEXT.md` tracks where you are:

```
Current Phase: 1
Phase Status: in_review
Jira Epic: (none yet)
Confluence Space: SD
```

| Status | Meaning |
|--------|---------|
| `not_started` | Phase planned but no work has begun |
| `in_review` | Docs/stories are being reviewed and refined |
| `backlog_ready` | Jira Epic and Stories are created, ready to develop |
| `in_progress` | Actively building features |
| `completed` | All stories done, retrospective written |

---

## Quick Commands Cheat Sheet

| I want to... | Say this |
|--------------|----------|
| Log a technical decision | "Create an ADR for switching to X" |
| Create Jira stories from docs | "Create the backlog for Phase 1" |
| Publish docs to Confluence | "Sync to Confluence" |
| Update just one Confluence page | "Sync the API docs to Confluence" |
| Finish a phase | "Phase 1 is done" |
| Start a brand new project | "Start a new project" |
| Check what phase we're in | "What phase are we in?" |

---

*This guide is part of the project documentation. Update it when skills or conventions change.*
