import {
  type JSONValue,
  type Row,
  t,
  table,
  type TableDatabase,
} from "/p/the8020/db/mod.ts";

const Settings = table("the8020__system__settings", {
  key: t.text().primaryKey(),
  value: t.json<JSONValue>(),
  definitionHash: t.text(),
  updatedAt: t.datetime().defaultNow(),
});

declare module "/p/the8020/db/types.ts" {
  interface Database extends TableDatabase<typeof Settings> {}
}

export type SettingRow = Row<typeof Settings>;
export default Settings;
