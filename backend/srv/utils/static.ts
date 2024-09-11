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

await removeAsync(dir.data(`static-cache.db`));
const store = new BunSqliteKeyValue(dir.data(`static-cache.db`));

export const staticFile = async (
  path: string,
  opt: { index: boolean; debug?: boolean }
) => {
  const glob = new Glob("**");

  const router = createRouter<{
    mime: string | null;
    fullpath: string;
    path: string;
  }>();
  let index = null as null | BunFile;

  const internal = {
    scanning: false,
    paths: new Set<string>(),
    rescan: async () => {},
    serve: (ctx: ServerCtx, arg?: { prefix?: string }) => {
      let pathname = ctx.url.pathname;
      if (arg?.prefix) {
        pathname = pathname.substring(arg.prefix.length);
      }
      const found = findRoute(router, undefined, pathname);

      if (opt.debug) {
        console.log(pathname, found);
      }
      if (found) {
        const { fullpath, mime } = found.data;
        if (exists(fullpath)) {
          if (ctx.req.headers.get("accept-encoding")?.includes("gz")) {
            let gz = store.get(fullpath);
            if (!gz) {
              gz = gzipSync(readFileSync(fullpath));
              store.set(fullpath, gz);
            }

            return new Response(gz, {
              headers: {
                "content-encoding": "gzip",
                "content-type": mime || "",
              },
            });
          }
        } else {
          store.delete(fullpath);
        }
      }

      if (opt.index) {
        return new Response(index);
      }
    },
  };

  const scan = async () => {
    if (internal.scanning) {
      await waitUntil(() => !internal.scanning);
      return;
    }
    internal.scanning = true;
    if (await existsAsync(path)) {
      if (internal.paths.size > 0) {
        store.delete([...internal.paths]);
      }

      for await (const file of glob.scan(path)) {
        if (file === "index.html") index = Bun.file(join(path, file));

        internal.paths.add(join(path, file));

        addRoute(router, undefined, `/${file}`, {
          mime: mime.getType(file),
          path: file,
          fullpath: join(path, file),
        });
      }
    }
    internal.scanning = false;
  };
  await scan();
  internal.rescan = scan;

  return internal;
};
