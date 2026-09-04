import { type Row, t, table, type TableDatabase } from "/p/the8020/db/mod.ts";

const Revisions = table("the8020__system__revisions", {
  domain: t.text().primaryKey(),
  revision: t.integer().default(0),
  updatedAt: t.datetime().defaultNow(),
}, {
  indexes: [{ columns: ["revision"] }],
});

declare module "/p/the8020/db/types.ts" {
  interface Database extends TableDatabase<typeof Revisions> {}
}

export type RevisionRow = Row<typeof Revisions>;
export default Revisions;
