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
    const { params } = ctx;
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

    if (site && pathname) {
      if (pathname.startsWith("_prasi")) {
        return await siteProdPrasi({ pathname, site_id, ctx });
      }

      if (pathname !== "index.html") {
        if (!site.asset) await waitUntil(() => site.asset);

        const res = site.asset!.serve(ctx, { prefix: `/prod/${site_id}` });
        if (res) return res;
      }
    }


    const accept = ctx.req.headers.get("accept-encoding") || "";
    const content = (await prodIndex(site_id, {})).render();
    if (accept.includes("zstd")) {
      const compressed = zstd.compress(encoder.encode(content) as any, 10);
      return new Response(compressed, {
        headers: { "content-type": "text/html", "content-encoding": "zstd" },
      });
    } else
     if (accept.includes("gz")) {
      const compressed = gzipSync(content);
      return new Response(compressed, {
        headers: { "content-type": "text/html", "content-encoding": "gzip" },
      });
    }
    return new Response(content, {
      headers: { "content-type": "text/html" },
    });
  },
};
