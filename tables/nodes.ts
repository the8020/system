import { type Row, t, table, type TableDatabase } from "@the8020/db";

const Nodes = table("the8020__system__nodes", {
  id: t.text().primaryKey(),
  url: t.text(),
  recipientAddress: t.text(),
  recipientPort: t.integer(),
  enabled: t.boolean().default(true),
  updatedAt: t.datetime().defaultNow(),
});

declare module "@the8020/db/types" {
  interface Database extends TableDatabase<typeof Nodes> {}
}

export type NodeRow = Row<typeof Nodes>;
export default Nodes;
