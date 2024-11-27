import { gzipSync } from "bun";
import { brotliCompress } from "node:zlib";
import * as zstd from "@bokuweb/zstd-wasm";
import type { ServerCtx } from "./ctx";

await zstd.init();
const br_cache = new Map<string, Buffer>();

const encoder = new TextEncoder();
export const compressed = async (
  ctx: ServerCtx,
  body: any,
  opt?: { headers?: any; br?: string }
) => {
  let content = body;
  if (typeof body !== "string" && !(body instanceof Buffer)) {
    content = JSON.stringify(body);
  }

  const accept = ctx.req.headers.get("accept-encoding") || "";
  if (accept.includes("zstd")) {
    if (typeof content === "string") {
      content = encoder.encode(content);
    }
    return new Response(zstd.compress(content), {
      headers: {
        "content-type": "application/json",
        "content-encoding": "zstd",
        ...opt?.headers,
      },
    });
  }

  if (opt?.br && accept.includes("br")) {
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

  if (accept.includes("gz")) {
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
