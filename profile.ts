import { msg } from "/p/the8020/system/i18n/messages.ts";
import { prepareTexts, text } from "/p/the8020/i18n/mod.ts";
import { field, z } from "/p/the8020/db/fields.ts";
import { newId } from "@the8020/kernel";

export const systemProfile = z.object({
  id: field(z.string().regex(/^sys-[a-z0-9]{10}$/), {
    label: msg("profile.system_id"),
    description: msg("profile.stable_identity_shared_by_every_node_using"),
  }),
  name: field(z.string().trim().min(1).max(120), {
    label: msg("profile.system_name"),
    description: msg("profile.a_name_that_distinguishes_this_system_such"),
  }),
  role: field(z.enum(["development", "test", "production"]), {
    label: msg("profile.environment"),
    description: msg(
      "profile.development_permits_direct_package_changes_test_including",
    ),
  }),
});
export type SystemProfile = z.infer<typeof systemProfile>;
const key = "system.profile";

/** Application-owned database setting; native recovery does not depend on it. */
export async function getSystemProfile(): Promise<SystemProfile> {
  const { default: Settings } = await import("./tables/settings.ts");
  let row = await Settings.select([Settings.value]).where(
    Settings.key,
    "=",
    key,
  )
    .executeTakeFirst();
  if (!row) {
    await Settings.insert({
      key,
      value: {
        id: newId("sys"),
        name: "Development",
        role: "development",
      },
      definitionHash: "the8020/system",
      updatedAt: new Date(),
    }).onConflict((conflict) => conflict.column("key").doNothing()).execute();
    row = await Settings.select([Settings.value]).where(Settings.key, "=", key)
      .executeTakeFirstOrThrow();
  }
  return systemProfile.parse(row.value);
}

export async function setSystemProfile(input: unknown): Promise<SystemProfile> {
  const { requirePermission } = await import("/p/the8020/auth/mod.ts");
  await requirePermission("the8020.system.profile.edit", "");
  const draft = systemProfile.omit({ id: true }).strict().parse(input);
  const current = await getSystemProfile();
  const profile = { ...current, ...draft };
  const { default: Settings } = await import("./tables/settings.ts");
  await Settings.update({ value: profile, updatedAt: new Date() })
    .where(Settings.key, "=", key).execute();
  return profile;
}

export async function requireDevelopment(): Promise<void> {
  if ((await getSystemProfile()).role !== "development") {
    const message = msg("profile.direct_changes_require_development");
    await prepareTexts(message);
    throw new Error(text(message));
  }
}
