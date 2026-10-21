import { AdminCommandError, kernel } from "@the8020/kernel";
import {
  parseCommandArguments,
  requiredCommandArgument,
} from "/p/the8020/packages/commands.ts";

/** Loaded lazily so the system package stays importable before auth tables. */
async function authorize(action: string, value: string) {
  const { requirePermission } = await import("/p/the8020/auth/mod.ts");
  await requirePermission(action, value);
}

function integer(value: string | boolean | undefined, name: string): number {
  if (typeof value !== "string" || !/^[0-9]+$/.test(value)) {
    throw new AdminCommandError({
      code: "invalid_arguments",
      message: `--${name} must be an integer`,
    });
  }
  return Number(value);
}

export async function listNodes() {
  await authorize("the8020.system.node.view", "");
  return await kernel.nodes.list();
}

export async function removeNode(...args: string[]) {
  const node = requiredCommandArgument(args, 0, "node ID");
  await authorize("the8020.system.node.edit", node);
  return await kernel.nodes.remove(node);
}

export async function setNode(...args: string[]) {
  const parsed = parseCommandArguments(args, {
    values: ["url", "recipient-address", "recipient-port"],
    booleans: ["enabled"],
  });
  for (
    const name of ["url", "recipient-address", "recipient-port", "enabled"]
  ) {
    if (parsed.options[name] === undefined) {
      throw new AdminCommandError({
        code: "invalid_arguments",
        message: `--${name} is required`,
      });
    }
  }
  const node = requiredCommandArgument(parsed.positionals, 0, "node ID");
  await authorize("the8020.system.node.edit", node);
  return await kernel.nodes.set({
    node_id: node,
    url: parsed.options.url,
    recipient_address: parsed.options["recipient-address"],
    recipient_port: integer(parsed.options["recipient-port"], "recipient-port"),
    enabled: parsed.options.enabled,
  }).then((node) => ({ node }));
}

export async function listSettings(...args: string[]) {
  const detail = args[0] === "detail";
  if (args.length > (detail ? 1 : 0)) {
    throw new AdminCommandError({
      code: "invalid_arguments",
      message: "usage: [detail]",
    });
  }
  await authorize("the8020.system.setting.view", "");
  const settings = await kernel.settings.global.list();
  return {
    settings: detail
      ? settings
      : settings.map(({ key, description }) => ({ key, description })),
  };
}

export async function getSetting(...args: string[]) {
  const key = requiredCommandArgument(args, 0, "setting key");
  await authorize("the8020.system.setting.view", key);
  return { setting: await kernel.settings.global.get(key) };
}

export async function setSetting(...args: string[]) {
  const key = requiredCommandArgument(args, 0, "setting key");
  const value = requiredCommandArgument(args, 1, "setting value");
  await authorize("the8020.system.setting.edit", key);
  return { setting: await kernel.settings.global.set(key, value) };
}

export async function unsetSetting(...args: string[]) {
  const key = requiredCommandArgument(args, 0, "setting key");
  await authorize("the8020.system.setting.edit", key);
  return { setting: await kernel.settings.global.unset(key) };
}
