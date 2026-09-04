import {
  type JSONValue,
  type Row,
  t,
  table,
  type TableDatabase,
} from "@the8020/db";

const Settings = table("the8020__system__settings", {
  key: t.text().primaryKey(),
  value: t.json<JSONValue>(),
  definitionHash: t.text(),
  updatedAt: t.datetime().defaultNow(),
});

declare module "@the8020/db/types" {
  interface Database extends TableDatabase<typeof Settings> {}
}

export type SettingRow = Row<typeof Settings>;
export default Settings;
