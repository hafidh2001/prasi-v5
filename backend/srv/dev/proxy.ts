import type { ServerCtx } from "../utils/server/ctx";

const dev = {
  base: "",
  baselen: 0,
};

export const devProxy = async ({ url, req, ws }: ServerCtx) => {
  if (ws) return undefined;

  const res = await new Promise<Response | undefined>(async (done) => {
    let retry = 0;
    while (true) {
      if (retry > 10) {
        done(undefined);
        break;
      }
      try {
        const res = await fetch(`http://localhost:3000${url.pathname}`);
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

  if (res)
    return new Response(await res.arrayBuffer(), {
      headers: { "content-type": res.headers.get("content-type") as string },
    });
  else {
    console.error(`Failed to get: ${url.pathname}`);
    return new Response("");
  }
};
