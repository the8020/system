Parent DOX: [8020 workspace](../AGENTS.md).

Framework source:
[agent0ai/dox/AGENTS.md](https://github.com/agent0ai/dox/blob/765ae4ac02cc884eefcd41a3d0f71941721adb89/AGENTS.md).

# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable
  docs must stay understandable from the nearest applicable AGENTS.md plus every
  parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path,
   read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide
   rules
7. If docs conflict, the closer doc controls local work details, but no child
   doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session
before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or
  quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child
index changes. Update child docs when parent changes alter local rules. Remove
stale or contradictory text immediately. Small edits that do not change behavior
or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences,
  durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX
  Index
- Each parent explains what its direct children cover and what stays owned by
  the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own
  purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user
  instructions; if there are no specific standards or instructions yet, leave it
  empty
- Verification must reflect an existing check; if no verification framework
  exists yet, leave it empty and update it when one exists

Default section order:

- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local
  version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for
  risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the
relevant child AGENTS.md

## Child DOX Index

This root retains repository-wide contracts and files outside the child scopes
below.

- [cbus/AGENTS.md](cbus/AGENTS.md): Declare the public `system.nodes.*` and
  `system.settings.*` administrative commands.
- [programs/AGENTS.md](programs/AGENTS.md): Expose ordinary node topology and
  global-setting administration programs.
- [src/AGENTS.md](src/AGENTS.md): Implement system command helpers and shared
  package-index revision bookkeeping.
- [tables/AGENTS.md](tables/AGENTS.md): Describe global settings, node topology,
  and shared revision markers.

# Purpose

- Own first-party system-wide settings, node topology, shared revisions, and
  bootstrap metadata as ordinary 80|20 database tables.
- This file is the root contract of the independent `the8020/system` repository.

# Ownership

- Own authored schemas and administrative command programs for global settings,
  nodes, and small cross-cutting system metadata.
- Do not own node-local kernel configuration, package activation, services,
  users, authentication sessions, or named secrets.

# Local Contracts

- Runtime values are stored in the system database; no package code receives
  database credentials.
- Missing global settings are inserted from kernel-owned typed definitions and
  existing values are never silently replaced when defaults change.
- Shared revisions are monotonic and let nodes detect relevant changes without
  scanning unrelated tables. The revision column is indexed because changed
  domains may keep one bounded latest marker per entity.
- `src/indexes.ts` publishes generic package-index invalidations: the `indexes`
  scalar and one `index:<package ID>` marker per owner advance in the same
  transaction as desired configuration. Nodes rebuild only changed fragments
  through `kernel.reindex`; missed notifications need no application-table scan.
  This is shared revision bookkeeping, not another configuration store or
  service.
- Generic kernel service restarts share that scalar and publish bounded latest
  restart, hard-restart, and source-update deduplication markers. The lifecycle
  owner interprets them; [tables/AGENTS.md](tables/AGENTS.md) records their
  domains.
- Flat `cbus/commands/*.toml` declarations use a required `command` field for
  the complete public name; filenames are arbitrary. They map visible
  `system.nodes.*` and `system.settings.*` commands to non-discoverable ordinary
  programs. Settings programs accept only definitions with global storage, and
  intentional input errors are structured command failures.

# Work Guidance

- Keep this package limited to shared settings, topology, and revision
  contracts; unrelated feature policy belongs in its owning package. Reuse the
  existing revision mechanism before inventing another configuration store or
  invalidation path.
- Keep durable values authoritative and node views derived, with bounded
  targeted refresh. Kernel changes are reserved for necessary node foundations,
  and shared-state failures are repaired and verified at their owner.

# Verification

- `deno task check` formats, lints, and type-checks all table modules.
- `deno task test` verifies stable table descriptors and authored field order.
