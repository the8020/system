import { field, z } from "/p/the8020/db/fields.ts";
import { newId } from "@the8020/kernel";

export const systemProfile = z.object({
  id: field(z.string().regex(/^sys-[a-z0-9]{10}$/), {
    label: "System ID",
    description:
      "Stable identity shared by every node using this system database.",
  }),
  name: field(z.string().trim().min(1).max(120), {
    label: "System name",
    description:
      "A name that distinguishes this system, such as Acceptance or Production Europe.",
  }),
  role: field(z.enum(["development", "test", "production"]), {
    label: "Environment",
    description:
      "Development permits direct package changes. Test (including backup, preproduction, and forks) and Production receive deployments.",
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
    throw new Error(
      "Direct package changes require a development system. Use Deployments to import a version.",
    );
  }
}
