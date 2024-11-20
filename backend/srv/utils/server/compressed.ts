import { gzipSync } from "bun";
import type { ServerCtx } from "./ctx";

export const compressed = (
  ctx: ServerCtx,
  body: any,
  opt?: { headers?: any }
) => {
  let content = body;
  if (typeof body !== "string" && !(body instanceof Buffer)) {
    content = JSON.stringify(body);
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
