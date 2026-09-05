Parent DOX: [system DOX](../AGENTS.md).

# Purpose

- Expose ordinary node topology and global-setting administration programs.

# Ownership

- Own hidden manifests and entrypoints; `../src/commands.ts` owns shared parsing
  and typed kernel calls.

# Local Contracts

- Settings commands accept only definitions with global storage and retain
  structured intentional input errors.
- Node-local kernel configuration stays in the kernel's node-local setting path.

# Work Guidance

# Verification

- From the repository root, run `deno task check` and `deno task test`.

# Child DOX Index

No child DOX documents. This document owns the entire local scope.
