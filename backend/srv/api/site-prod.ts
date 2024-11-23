import { waitUntil } from "prasi-utils";
import type { ServerCtx } from "../utils/server/ctx";
import { prodIndex } from "../utils/server/prod-index";
import { siteProdPrasi } from "../utils/site/site-prod-prasi";
import { siteInit } from "../utils/site/site-init";

export default {
  url: "/prod/:site_id/**",
  async api(ctx: ServerCtx) {
    const { params } = ctx;
    const site_id = params.site_id as string;
    const pathname = params._ as string;

    const site = g.site.loaded[site_id];

    if (!site) {
      siteInit(site_id);
      return new Response(`\
Loading Site: ${site_id}
Status: ${g.site.loading[site_id].status}
<script>
setTimeout(() => {
  window.location.reload();
}, 1000);
</script>
`);
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

    return new Response((await prodIndex(site_id, {})).render(), {
      headers: { "content-type": "text/html" },
    });
  },
};
