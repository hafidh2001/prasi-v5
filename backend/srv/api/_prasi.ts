import { dir } from "utils/files/dir";
import { editor } from "utils/editor";
import { compressed } from "utils/server/compressed";
import type { ServerCtx } from "utils/server/ctx";

export default {
  url: "/_prasi/**",
  api: async (ctx: ServerCtx) => {
    const { params, req, query_params } = ctx;
    const path = params._;
    switch (true) {
      case path === "editor-prisma-typings.d.ts": {
        
        const prasi_prisma = await Bun.file(
          dir.root(`./node_modules/.prisma/client/index.d.ts`)
        ).text();

        return await compressed(
          ctx,
          `
declare global { 
 ${prasi_prisma}
}
export {}`,
          {
            br: "editor-prisma-typings",
          }
        );
      }
      case path === "editor-prisma-runtime.d.ts": {
        const prasi_prisma = await Bun.file(
          dir.root(`./node_modules/@prisma/client/runtime/library.d.ts`)
        ).text();

        return await compressed(
          ctx,
          `declare module '@prisma/client/runtime/library.js' { 
 ${prasi_prisma}
}`,
          {
            br: "editor-prisma-runtime",
          }
        );
      }
      case path === "editor-typings.d.ts": {
        const prasi = await Bun.file(
          dir.root(`/frontend/src/nova/ed/cprasi/prasi-typings-generated.d.ts`)
        ).text();
        return await compressed(ctx, prasi, { br: "editor-typings" });
      }
      case path.startsWith("load.js"): {
        const res = await editor.load_cached({
          type: "prasi-load-js",
          key: ctx.url.full,
          loader: async () => {
            const url = query_params["url"]
              ? JSON.stringify(query_params["url"])
              : "undefined";

            const is_remote = query_params["remote"];
            if (is_remote) {
              const cur_url = new URL(req.url);
              const remote_url = new URL(query_params["url"]);
              cur_url.hostname = remote_url.hostname;
              cur_url.port = remote_url.port;
              cur_url.protocol = remote_url.protocol;
              const res = await (await fetch(cur_url.toString())).text();
              return res;
            }

            const mode = query_params["dev"] ? "dev" : "prod";

            let src = "";
            if (mode === "dev") {
              src = `\
(() => {
const baseurl = new URL(${url})
const url = \`\${baseurl.protocol}//\${baseurl.host}\`;
const w = window;
if (!w.prasiApi) {
  w.prasiApi = {};
}

w.prasiApi[url] = {
}
})();`;
            } else {
              src = `\
(() => {
const baseurl = new URL(${url})
const url = \`\${baseurl.protocol}//\${baseurl.host}\`;
const w = window;
if (!w.prasiApi) {
  w.prasiApi = {};
}

w.prasiApi[url] = {
}
})();`;
            }
            return src;
          },
        });

        return await compressed(ctx, res, {
          headers: { "content-type": "text/javascript" },
        });
      }
    }

    return new Response("");
  },
};
