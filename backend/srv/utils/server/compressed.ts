import { gzipSync } from "bun";
import { brotliCompress } from "node:zlib";
import type { ServerCtx } from "./ctx";

const br_cache = new Map<string, Buffer>();

export const compressed = (
  ctx: ServerCtx,
  body: any,
  opt?: { headers?: any; br?: string }
) => {
  let content = body;
  if (typeof body !== "string" && !(body instanceof Buffer)) {
    content = JSON.stringify(body);
  }

  if (opt?.br && ctx.req.headers.get("accept-encoding")?.includes("br")) {
    if (!br_cache.has(opt.br)) {
      setTimeout(() => {
        brotliCompress(content, (err, res) => {
          if (opt.br && !err) br_cache.set(opt.br, res);
        });
      }, 3000);
    } else {
      return new Response(br_cache.get(opt.br), {
        headers: {
          "content-type": "application/json",
          "content-encoding": "br",
          ...opt?.headers,
        },
      });
    }
  }

  if (ctx.req.headers.get("accept-encoding")?.includes("gz")) {
    return new Response(gzipSync(content), {
      headers: {
        "content-type": "application/json",
        "content-encoding": "gzip",
        ...opt?.headers,
      },
    });
  }

  return new Response(content, {
    headers: { "content-type": "application/json", ...opt?.headers },
  });
};
