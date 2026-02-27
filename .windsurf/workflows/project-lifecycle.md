---
description: Global project lifecycle — enforces planning, documentation, change tracking, and phase discipline across all development work
---

# Project Lifecycle Rules

Every project follows a phased lifecycle. These rules apply at all times.

## Phase Awareness

Before implementing any feature, check `docs/PROJECT_CONTEXT.md` for the current phase scope. If a `phase` field exists at the top of that file (YAML frontmatter or a "Current Phase" section), respect it. Do NOT build features scoped to future phases unless the user explicitly overrides.

## Change Tracking

When your implementation **deviates** from what's documented (different library, different approach, schema change, dropped requirement, added requirement):

1. Create an ADR in `docs/decisions/NNNN-short-title.md` using the template in that folder's `_template.md`.
2. Update the affected doc(s) in `docs/` to reflect the new reality.
3. Append an entry to `CHANGELOG.md` under the current phase's `[Unreleased]` section.
4. Mention the ADR number in your commit message.

## Commit Messages

Use the format: `type(scope): description [JIRA-KEY]` when a Jira key exists.

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Documentation Sync

`docs/` is the source of truth. Confluence is a publish target — never treat Confluence as the canonical source. After significant doc changes, remind the user to sync to Confluence (or offer to do it via the Atlassian MCP).

## Workflows Available

These workflows automate lifecycle steps. The agent should suggest them at the right moment:

- **/project-kickoff**: Use when starting a brand new project from scratch.
- **/track-change**: Use when a decision deviates from the documented plan.
- **/create-phase-backlog**: Use when a phase's docs are approved and you need Jira stories.
- **/sync-to-confluence**: Use when docs need to be published or updated in Confluence.
- **/phase-complete**: Use when all stories in a phase Epic are done.
