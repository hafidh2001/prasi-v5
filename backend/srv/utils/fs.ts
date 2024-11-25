import { dir } from "./dir";

const internal = Symbol("internal");

export const fs = {
  async exists(path: string) {
    return await Bun.file(this.path(path)).exists()
  },
  path(path: string) {
    const all_prefix = this[internal].prefix as Record<string, string>;
    const prefix_key = Object.keys(all_prefix).find((e) => path.startsWith(e));
    const prefix_path = all_prefix[prefix_key!];

    if (prefix_key && prefix_path) {
      return `${prefix_path}/${path.substring(prefix_key.length + 1)}`;
    }
    return path;
  },
  [internal]: {
    prefix: {
      root: dir.root(""),
      data: dir.data(""),
      srv: dir.root("backend/srv"),
      code: dir.data("code/"),
      db: dir.root("backend/db"),
    },
  },
};
