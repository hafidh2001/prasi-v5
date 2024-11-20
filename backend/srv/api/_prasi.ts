import { dir } from "../utils/dir";
import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/_prasi/**",
  api: async (ctx: ServerCtx) => {
    const { params, req, query_params } = ctx;
    const path = params._;
    switch (true) {
      case path === "editor-typings.d.ts":
        return new Response(
          Bun.file(
            dir.root(
              `/frontend/src/nova/ed/cprasi/prasi-typings-generated.d.ts`
            )
          )
        );
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

        return compressed(ctx, res, {
          headers: { "content-type": "text/javascript" },
        });
      }
    }

    return new Response("");
  },
};
