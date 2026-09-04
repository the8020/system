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
- `cbus/commands/**/command.toml` maps visible `system.nodes.*` and
  `system.settings.*` commands to non-discoverable ordinary programs. Settings
  programs accept only definitions with global storage, and intentional input
  errors are structured command failures.

# Verification

- `deno task check` formats, lints, and type-checks all table modules.
- `deno task test` verifies stable table descriptors and authored field order.

# Child DOX Index
