import type { Transaction } from "kysely";
import type { Database } from "/p/the8020/db/mod.ts";
import Revisions from "../tables/revisions.ts";

/** Serialize a short authoritative update with index invalidation on both backends. */
export async function lockIndexRevision(
  tx: Transaction<Database>,
): Promise<number> {
  const row = await tx.insertInto(Revisions.table).values({
    domain: "indexes",
    revision: 0,
    updatedAt: new Date(),
  }).onConflict((conflict) =>
    // Qualify the column: inside ON CONFLICT DO UPDATE the target table and the
    // proposed-row alias both carry revision, and PostgreSQL rejects the bare
    // name as ambiguous. SQLite resolves it to the target table, so the
    // unqualified form only ever failed on PostgreSQL.
    conflict.column("domain").doUpdateSet((eb) => ({
      revision: eb.ref(`${Revisions.table}.revision`),
    }))
  ).returning("revision").executeTakeFirstOrThrow();
  return row.revision;
}

/** Commit these markers in the same transaction as the desired configuration. */
export async function invalidateIndexes(
  tx: Transaction<Database>,
  packageIds: readonly string[],
): Promise<void> {
  if (packageIds.length === 0) return;
  for (const id of packageIds) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(id)) {
      throw new TypeError(`invalid package ID: ${id}`);
    }
  }
  await lockIndexRevision(tx);
  const now = new Date();
  const { revision } = await tx.updateTable(Revisions.table).set((eb) => ({
    revision: eb("revision", "+", 1),
    updatedAt: now,
  })).where("domain", "=", "indexes").returning("revision")
    .executeTakeFirstOrThrow();
  for (const id of new Set(packageIds)) {
    await tx.insertInto(Revisions.table).values({
      domain: `index:${id}`,
      revision,
      updatedAt: now,
    }).onConflict((conflict) =>
      conflict.column("domain").doUpdateSet({
        revision,
        updatedAt: now,
      })
    ).execute();
  }
}
