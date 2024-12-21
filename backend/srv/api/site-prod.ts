import { waitUntil } from "prasi-utils";
import type { ServerCtx } from "../utils/server/ctx";
import { prodIndex } from "../utils/server/prod-index";
import { siteInit } from "../utils/site/site-init";
import { siteProdPrasi } from "../utils/site/site-prod-prasi";
import { asset } from "utils/server/asset";
import * as zstd from "@bokuweb/zstd-wasm";
import { gzipSync } from "bun";

await zstd.init();
const encoder = new TextEncoder();
export default {
  url: "/prod/:site_id/**",
  async api(ctx: ServerCtx) {
    const { params, req } = ctx;
    const site_id = params.site_id as string;
    const pathname = params._ as string;

    if (site_id === "prasi") {
      if (pathname.startsWith("psc")) {
        return asset.psc.serve(ctx, {
          prefix: `/prod/prasi/psc/`,
          debug: true,
        });
      }
      return new Response("");
    }

    const site = g.site.loaded[site_id];

    if (!site) {
      siteInit(site_id);
      return new Response(
        `\
<pre>
${g.site.loading[site_id].status}
------------------------------------
${site_id}
</pre>
<script>
setTimeout(() => {
  window.location.reload();
}, 1000);
</script>
`,
        { headers: { "content-type": "text/html" } }
      );
    }

    const server = site.build.run_backend;
    if (server && server.port) {
      const url = `http://127.0.0.1:${server.port}/${pathname}`;
      return await fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
    }

    return new Response("Site not ready", { status: 503 });
  },
};
