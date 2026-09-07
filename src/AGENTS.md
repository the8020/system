Parent DOX: [system DOX](../AGENTS.md).

# Purpose

- Implement system command helpers and shared package-index revision
  bookkeeping.

# Ownership

- Own `commands.ts` and `indexes.ts`; tables own storage descriptors.

# Local Contracts

- Advance the generic indexes scalar and per-package revision markers in the
  same transaction as desired configuration.
- Consumers rebuild only changed fragments through kernel.reindex; this module
  owns no service configuration store.

# Work Guidance

- Keep revision bookkeeping reusable and independent of the publishing
  feature. Consumers own their configuration and failure handling; update
  values and revision together, then rebuild only affected derived views.

# Verification

- From the repository root, run `deno task check` and `deno task test`.

# Child DOX Index

No child DOX documents. This document owns the entire local scope.
