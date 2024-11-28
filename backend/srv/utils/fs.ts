import { $ } from "bun";
import { mkdirSync, statSync } from "fs";
import { dir } from "./dir";

const internal = Symbol("internal");

export const fs = {
  exists(path: string) {
    try {
      const s = statSync(this.path(path));
      return s.isDirectory() || s.isFile();
    } catch (e) {}
    return false;
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
  async copy(from: string, to: string) {
    const from_dir = this.path(from);
    const to_dir = this.path(to);
    const is_dir = statSync(from_dir).isDirectory();
    if (is_dir && !(await this.exists(to_dir))) {
      mkdirSync(to_dir, { recursive: true });
    }
    return await $`cp -r ${from_dir} ${to_dir}`;
  },

  async modify(arg: {
    path: string;
    save: (content: any) => string | object | Promise<string | object>;
    as?: "json" | "string";
  }) {
    const as = arg.as || arg.path.endsWith(".json") ? "json" : "string";
    const content = await this.read(arg.path, as);
    const result = await arg.save(content);
    return await this.write(arg.path, result);
  },
  async read(path: string, as?: "json" | "string") {
    const file = Bun.file(this.path(path));
    if (as === "json") {
      return await file.json();
    }

    return await file.text();
  },

  async write(path: string, data: any) {
    const file = Bun.file(this.path(path));
    if (typeof data === "object") {
      return await Bun.write(file, JSON.stringify(data, null, 2), {
        createPath: true,
      });
    }

    return await Bun.write(file, data, {
      createPath: true,
    });
  },
  [internal]: {
    prefix: {
      root: dir.root(""),
      data: dir.data(""),
      srv: dir.root("backend/srv"),
      code: dir.data("code"),
      db: dir.root("backend/db"),
    },
  },
};
