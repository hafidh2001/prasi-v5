import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/_prasi/**",
  api: async ({ url, params, req, query_params }: ServerCtx) => {
    const path = params._;
    switch (true) {
      case path.startsWith("load.js"): {
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

          return new Response(res, {
            headers: { "content-type": "text/javascript; charset=UTF-8" },
          });
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
        return new Response(src, {
          headers: { "content-type": "text/javascript; charset=UTF-8" },
        });
      }
    }

    return new Response("");
  },
};
