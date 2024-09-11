import { Glob, gzipSync, type BunFile } from "bun";
import { existsAsync } from "fs-jetpack";
import { join } from "path";
import { addRoute, createRouter, findRoute } from "rou3";
import type { ServerCtx } from "./server/ctx";
import mime from "mime";
import { BunSqliteKeyValue } from "bun-sqlite-key-value";
import { dir } from "./dir";
import { readFileSync } from "node:fs";
import { gzipAsync } from "./server/zlib";

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
  // Scans the current working directory and each of its sub-directories recursively

  if (await existsAsync(path)) {
    for await (const file of glob.scan(path)) {
      if (file === "index.html") index = Bun.file(join(path, file));
      addRoute(router, undefined, `/${file}`, {
        mime: mime.getType(file),
        path: file,
        fullpath: join(path, file),
      });

      // if (opt.debug) {
      //   console.log(`/${file}`, mime.getType(file));
      // }
    }
  }
  return {
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
        if (ctx.req.headers.get("accept-encoding")?.includes("gz")) {
          let gz = store.get(`gz|${fullpath}`);
          if (!gz) { 
            gz = gzipSync(readFileSync(fullpath));
            store.set(`gz|${fullpath}`, gz);
          } 
          
          return new Response(gz, {
            headers: { "content-encoding": "gzip", "content-type": mime || "" },
          });
        }
      }

      if (opt.index) {
        return new Response(index);
      }
    },
  };
};
