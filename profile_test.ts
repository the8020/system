import { assertEquals, assertRejects } from "@std/assert";
import {
  kernelDatabaseBackendSymbol,
  type KernelInvoke,
  kernelInvokeSymbol,
} from "@the8020/kernel";
import {
  defaultConfiguration,
  Localization,
  withLocalization,
} from "/p/the8020/i18n/mod.ts";
import czech from "./i18n/locales/cs.json" with { type: "json" };
import english from "./i18n/locales/en.json" with { type: "json" };
import { requireDevelopment } from "./profile.ts";

Deno.test("direct package policy resolves errors in the invocation language", async () => {
  const globals = globalThis as unknown as Record<symbol, unknown>;
  const originalInvoke = globals[kernelInvokeSymbol];
  const originalBackend = globals[kernelDatabaseBackendSymbol];
  let role = "development";
  globals[kernelDatabaseBackendSymbol] = "sqlite";
  globals[kernelInvokeSymbol] = ((operation, input) => {
    assertEquals(operation, "database.execute");
    assertEquals(input.parameters, ["system.profile"]);
    return Promise.resolve({
      columns: ["value"],
      rows: [[JSON.stringify({ id: "sys-aaaaaaaaaa", name: "Test", role })]],
    });
  }) satisfies KernelInvoke;
  try {
    for (
      const [language, catalog, expected] of [
        [
          "cs",
          czech,
          "Přímé změny balíčků vyžadují vývojový systém. Verzi importujte pomocí Nasazení.",
        ],
        [
          "en",
          english,
          "Direct package changes require a development system. Use Deployments to import a version.",
        ],
      ] as const
    ) {
      let loads = 0;
      const localization = new Localization(
        language,
        defaultConfiguration,
        (packageId, chain) => {
          assertEquals(packageId, "the8020/system");
          assertEquals(chain[0], language);
          loads++;
          return Promise.resolve({
            package: packageId,
            language,
            texts: catalog.texts,
          });
        },
      );
      await withLocalization(localization, async () => {
        role = "development";
        await requireDevelopment();
        assertEquals(loads, 0);
        for (role of ["test", "production"]) {
          const error = await assertRejects(requireDevelopment, Error);
          assertEquals(error.message, expected);
        }
        assertEquals(loads, 1);
      });
    }
    await assertRejects(requireDevelopment, Error, "Direct package changes");
  } finally {
    globals[kernelInvokeSymbol] = originalInvoke;
    globals[kernelDatabaseBackendSymbol] = originalBackend;
  }
});
