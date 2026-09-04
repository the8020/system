import {
  AdminCommandError,
  kernel,
  parseCommandArguments,
  requiredCommandArgument,
} from "@the8020/kernel";

function integer(value: string | boolean | undefined, name: string): number {
  if (typeof value !== "string" || !/^[0-9]+$/.test(value)) {
    throw new AdminCommandError({
      code: "invalid_arguments",
      message: `--${name} must be an integer`,
    });
  }
  return Number(value);
}

export function listNodes() {
  return kernel.nodes.list();
}

export function removeNode(...args: string[]) {
  return kernel.nodes.remove(requiredCommandArgument(args, 0, "node ID"));
}

export function setNode(...args: string[]) {
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
  return kernel.nodes.set({
    node_id: requiredCommandArgument(parsed.positionals, 0, "node ID"),
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
  const settings = await kernel.settings.global.list();
  return {
    settings: detail
      ? settings
      : settings.map(({ key, description }) => ({ key, description })),
  };
}

export function getSetting(...args: string[]) {
  return kernel.settings.global.get(
    requiredCommandArgument(args, 0, "setting key"),
  )
    .then((setting) => ({ setting }));
}

export function setSetting(...args: string[]) {
  return kernel.settings.global.set(
    requiredCommandArgument(args, 0, "setting key"),
    requiredCommandArgument(args, 1, "setting value"),
  ).then((setting) => ({ setting }));
}

export function unsetSetting(...args: string[]) {
  return kernel.settings.global.unset(
    requiredCommandArgument(args, 0, "setting key"),
  )
    .then((setting) => ({ setting }));
}
