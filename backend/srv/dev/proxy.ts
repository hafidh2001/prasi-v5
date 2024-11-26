import { gzipSync } from "bun";
import type { ServerCtx } from "../utils/server/ctx";
import { waitUntil } from "prasi-utils";
import { setupDevPort } from "./port";

const dev = {
  base: "",
  baselen: 0,
};

export const devProxy = async ({ url, req, ws }: ServerCtx) => {
  if (ws) return undefined;
 
  if (!g.rsbuild) { 
    await setupDevPort();
    await waitUntil(() => g.rsbuild);
  }

  const target_url = `http://localhost:${g.rsbuild.prasi_port}${url.pathname}`;
  const res = await new Promise<Response | undefined>(async (done) => {
    let retry = 0;
    while (true) {
      if (retry > 10) {
        done(undefined);
        break;
      }
      try {
        const res = await fetch(target_url);
        done(res);
        break;
      } catch (e) {
        retry++;
        await new Promise<void>((done) => {
          setTimeout(done, 500);
        });
      }
    }
  });

  if (res) {
    const headers = url.pathname.startsWith("/static/js/async/vendors-")
      ? { "cache-control": "public, max-age=604800, immutable" }
      : undefined;
    return new Response(await res.arrayBuffer(), {
      headers: {
        ...headers,
        "content-type": res.headers.get("content-type") as string,
      },
    });
  } else {
    console.error(`Failed to get: ${target_url}`);
    return new Response("");
  }
};
