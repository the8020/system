import { type Row, t, table, type TableDatabase } from "/p/the8020/db/mod.ts";

const Nodes = table("the8020__system__nodes", {
  id: t.text().primaryKey(),
  url: t.text(),
  recipientAddress: t.text(),
  recipientPort: t.integer(),
  enabled: t.boolean().default(true),
  updatedAt: t.datetime().defaultNow(),
});

declare module "/p/the8020/db/types.ts" {
  interface Database extends TableDatabase<typeof Nodes> {}
}

export type NodeRow = Row<typeof Nodes>;
export default Nodes;
