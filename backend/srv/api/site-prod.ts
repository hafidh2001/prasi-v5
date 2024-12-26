import * as zstd from "@bokuweb/zstd-wasm";
import { asset } from "utils/server/asset";
import type { ServerCtx } from "../utils/server/ctx";
import { siteInit } from "../utils/site/site-init";

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
    let site_ready = false;
    if (
      site &&
      site.vm.init &&
      typeof site.vm.ctx?.prasi?.handler?.http === "function"
    ) {
      site_ready = true;
    }

    if (!site) {
      siteInit(site_id);
    }

    if (!site_ready) {
      return new Response(
        `\
<pre>
${g.site.loading[site_id]?.status || "Preparing Site..."}
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

    return await site.vm.ctx.prasi.handler?.http(req);
  },
};
