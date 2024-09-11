import { gzipSync } from "bun";
import type { ServerCtx } from "./ctx";

export const compressed = (ctx: ServerCtx, body: any) => {
  let content = body;
  if (typeof body !== "string") {
    content = JSON.stringify(body);
  }

  if (ctx.req.headers.get("accept-encoding")?.includes("gz")) {
    return new Response(gzipSync(content), {
      headers: {
        "content-type": "application/json",
        "content-encoding": "gzip",
      },
    });
  }

  return new Response(content, {
    headers: { "content-type": "application/json" },
  });
};
