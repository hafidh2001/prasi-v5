import { Glob, gzipSync, type BunFile } from "bun";
import { BunSqliteKeyValue } from "bun-sqlite-key-value";
import { exists, existsAsync, removeAsync } from "fs-jetpack";
import mime from "mime";
import { readFileSync } from "node:fs";
import { join } from "path";
import { waitUntil } from "prasi-utils";
import { addRoute, createRouter, findRoute } from "rou3";
import { dir } from "./dir";
import type { ServerCtx } from "./server/ctx";

if (!g.static_cache) {
  await removeAsync(dir.data(`static-cache.db`));
  g.static_cache = new BunSqliteKeyValue(dir.data(`static-cache.db`));
}
 
const store = g.static_cache;

export const staticFile = async (
  path: string,
  opt: { index: boolean; debug?: boolean }
) => {
  const glob = new Glob("**");

  const internal = {
    index: null as null | BunFile,
    rescan_timeout: null as any,
    router: createRouter<{
      mime: string | null;
      fullpath: string;
      path: string;
    }>(),
  };
  const static_file = {
    scanning: false,
    paths: new Set<string>(),
    async rescan() {}, // rescan will be overwritten below.
    serve: (ctx: ServerCtx, arg?: { prefix?: string; debug?: boolean }) => {
      let pathname = ctx.url.pathname || "";
      if (arg?.prefix && pathname) {
        pathname = pathname.substring(arg.prefix.length);
      }
      const found = findRoute(internal.router, undefined, pathname);

      if (found) {
        const { fullpath, mime } = found.data;
        if (exists(fullpath)) {
          if (ctx.req.headers.get("accept-encoding")?.includes("gz")) {
            let gz = store.get(fullpath);
            if (!gz) {
              gz = gzipSync(new Uint8Array(readFileSync(fullpath)));
              store.set(fullpath, gz);
            }

            const headers: any = {
              "content-encoding": "gzip",
              "content-type": mime || "",
            };
            if (g.mode === "prod") {
              headers["cache-control"] = "public, max-age=604800, immutable";
            }
            return new Response(gz, {
              headers,
            });
          }
        } else {
          store.delete(fullpath);
        }
      }

      if (opt.index) {
        return new Response(internal.index);
      }
    },
  };

  const scan = async () => {
    if (static_file.scanning) {
      await waitUntil(() => !static_file.scanning);
      return;
    }
    static_file.scanning = true;
    if (await existsAsync(path)) {
      if (static_file.paths.size > 0) {
        store.delete([...static_file.paths]);
      }

      for await (const file of glob.scan(path)) {
        if (file === "index.html") internal.index = Bun.file(join(path, file));

        static_file.paths.add(join(path, file));

        let type = mime.getType(file);
        if (file.endsWith(".ts")) {
          type = "application/javascript";
        }

        addRoute(internal.router, undefined, `/${file}`, {
          mime: type,
          path: file,
          fullpath: join(path, file),
        });
      }
    }
    static_file.scanning = false;
  };
  await scan();

  static_file.rescan = () => {
    return new Promise<void>((resolve) => {
      clearTimeout(internal.rescan_timeout);
      internal.rescan_timeout = setTimeout(async () => {
        await scan();
        resolve();
      }, 300);
    });
  };

  return static_file;
};
