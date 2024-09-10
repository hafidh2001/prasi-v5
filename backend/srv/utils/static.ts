import { Glob, type BunFile } from "bun";
import { dir } from "./dir";
import { addRoute, createRouter, findRoute } from "rou3";
import type { ServerCtx } from "./server/ctx";
import { join } from "path";
export const staticFile = async (path: string) => {
  const glob = new Glob("**");

  const router = createRouter<BunFile>();
  let index = null as null | BunFile;
  // Scans the current working directory and each of its sub-directories recursively
  for await (const file of glob.scan(dir.root(path))) {
    if (file === "index.html") index = Bun.file(dir.root(join(path, file)));
    addRoute(
      router,
      undefined,
      `/${file}`,
      Bun.file(dir.root(join(path, file)))
    );
  }

  return {
    serve: (ctx: ServerCtx) => {
      const found = findRoute(router, undefined, ctx.url.pathname);
      if (found) {
        return new Response(found.data);
      }

      return new Response(index);
    },
  };
};
