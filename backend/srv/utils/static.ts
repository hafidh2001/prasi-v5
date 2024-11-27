import * as zstd from "@bokuweb/zstd-wasm";
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

await zstd.init();
export const staticFile = async (
  path: string,
  opt?: { index?: string; debug?: boolean }
) => {
  if (typeof g === "undefined") {
    (global as any).g = global;
  }

  if (!g.static_cache) {
    g.static_cache = {} as any;

    if (!g.static_cache.gz) {
      g.static_cache.gz = new BunSqliteKeyValue(":memory:");
    }

    if (!g.static_cache.zstd) {
      g.static_cache.zstd = new BunSqliteKeyValue(":memory:");
    }
  }

  const store = g.static_cache;

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
    // rescan will be overwritten below.
    async rescan(arg?: { immediatly?: boolean }) {},
    serve: (ctx: ServerCtx, arg?: { prefix?: string; debug?: boolean }) => {
      let pathname = ctx.url.pathname || "";
      if (arg?.prefix && pathname) {
        pathname = pathname.substring(arg.prefix.length);
      }
      const found = findRoute(internal.router, undefined, pathname);

      if (found) {
        const { fullpath, mime } = found.data;
        if (exists(fullpath)) {
          const accept = ctx.req.headers.get("accept-encoding") || "";
          const headers: any = {
            "content-type": mime || "",
          };
          let content = null as any;

          if (accept.includes("zstd")) {
            content = store.zstd.get(fullpath);
            if (!content) {
              content = zstd.compress(
                new Uint8Array(readFileSync(fullpath)) as any,
                10
              );
              store.zstd.set(fullpath, content);
            }
            headers["content-encoding"] = "zstd";
          }

          if (!content && accept.includes("gz")) {
            content = store.gz.get(fullpath);
            if (!content) {
              content = gzipSync(new Uint8Array(readFileSync(fullpath)));
              store.gz.set(fullpath, content);
            }
            headers["content-encoding"] = "gzip";
          }

          if (g.mode === "prod") {
            headers["cache-control"] = "public, max-age=604800, immutable";
          }
          return new Response(content, {
            headers,
          });
        } else {
          store.gz.delete(fullpath);
          store.zstd.delete(fullpath);
        }
      }

      if (opt?.index) {
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
        store.gz.delete([...static_file.paths]);
        store.zstd.delete([...static_file.paths]);
      }

      for await (const file of glob.scan(path)) {
        if (file === opt?.index) internal.index = Bun.file(join(path, file));

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

  static_file.rescan = (arg?: { immediatly?: boolean }) => {
    return new Promise<void>((resolve) => {
      clearTimeout(internal.rescan_timeout);
      internal.rescan_timeout = setTimeout(
        async () => {
          await scan();
          resolve();
        },
        arg?.immediatly ? 0 : 300
      );
    });
  };

  return static_file;
};
