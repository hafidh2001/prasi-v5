import { waitUntil } from "prasi-utils";
import { prasiLoader } from "../utils/loader/prasi-prod";
import { loadSite, siteLoaded, siteLoading } from "../utils/loader/site";
import type { ServerCtx } from "../utils/server/ctx";
import { prodIndex } from "../utils/server/prod-index";

export default {
  url: "/prod/:site_id/**",
  async api(ctx: ServerCtx) {
    const { params } = ctx;
    const site_id = params.site_id as string;
    const pathname = params._ as string;
    if (!siteLoaded(site_id)) {
      if (!siteLoading(site_id)) {
        loadSite(site_id);
      }
      if (pathname.endsWith(".js")) {
        return new Response(
          `\
console.log("Building frontend...");
setTimeout(() => { location.reload() }, 2000)
`,
          {
            headers: { "content-type": "text/javascript" },
          }
        );
      }
      return new Response(
        `\
<div style="font-family:monospace;">
Loading Site...
</div>
<script>setTimeout(() =>{ location.reload() }, 2000)</script>`,
        {
          headers: { "content-type": "text/html" },
        }
      );
    }

    const site = g.site[site_id];

    if (site && pathname) {
      if (pathname.startsWith("_prasi")) {
        return await prasiLoader({ pathname, site_id, ctx });
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
