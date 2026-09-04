import { assertEquals } from "@std/assert";
import { kernelDatabaseBackendSymbol } from "@the8020/kernel";

(globalThis as unknown as Record<symbol, unknown>)[
  kernelDatabaseBackendSymbol
] = "sqlite";
const { descriptorOf } = await import("/p/the8020/db/mod.ts");
const Nodes = (await import("./nodes.ts")).default;
const Revisions = (await import("./revisions.ts")).default;
const Settings = (await import("./settings.ts")).default;

Deno.test("system tables have stable identities and source field order", () => {
  assertEquals(
    [Settings, Nodes, Revisions].map((value) => value.table),
    [
      "the8020__system__settings",
      "the8020__system__nodes",
      "the8020__system__revisions",
    ],
  );
  assertEquals(
    descriptorOf(Settings).columns.map((column) => column.name),
    ["key", "value", "definitionHash", "updatedAt"],
  );
  assertEquals(descriptorOf(Revisions).indexes, [
    {
      name: "the8020__system__revisions__revision__index",
      columns: ["revision"],
      unique: false,
    },
  ]);
});
