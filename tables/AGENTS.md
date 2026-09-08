Parent DOX: [system DOX](../AGENTS.md).

# Purpose

- Describe global settings, node topology, and shared revision markers.

# Ownership

- Own `settings.ts`, `nodes.ts`, and `revisions.ts` and their descriptor tests;
  physical schema deployment remains kernel-owned.

# Local Contracts

- Default-export authored table descriptors through `/p/the8020/db/mod.ts`;
  table identity follows the package and file path.
- Preserve monotonic indexed revisions and authored field order.
- The kernel lifecycle owner publishes `restart:<service ID>` with the shared
  `indexes` scalar in one transaction. `restart-hard:<service ID>` retains its
  last hard revision; `restart-update:<service ID>` retains the latest source
  revision handled for deduplication. Each domain holds one latest marker;
  application configuration still uses `index:<package ID>` markers.
- Existing settings values are not silently replaced when kernel defaults
  change.

# Work Guidance

# Verification

- From the repository root, run `deno task check` and `deno task test`.

# Child DOX Index

No child DOX documents. This document owns the entire local scope.
