import { dir } from "../utils/dir";
import { prasiLoader } from "../utils/loader/prasi";
import { loadSite, siteLoaded, siteLoading } from "../utils/loader/site";
import type { ServerCtx } from "../utils/server/ctx";
import { prodIndex } from "../utils/server/prod-index";

export default {
  url: "/prod/:site_id/**",
  async api({ params }: ServerCtx) {
    const site_id = params.site_id as string;
    const pathname = params._ as string;

    if (!siteLoaded(site_id)) {
      if (!siteLoading(site_id)) {
        loadSite(site_id);
      }
      return new Response("Loading Site...");
    }

    if (pathname.startsWith("_prasi")) {
      return await prasiLoader({ pathname, site_id });
    }

    if (pathname !== "index.html") {
      const file = Bun.file(dir.data(`/code/${site_id}/site/build/output/${pathname}`));
      if (await file.exists()) {
        return new Response(file);
      }
    }
    return new Response((await prodIndex(site_id, {})).render(), {
      headers: { "content-type": "text/html" },
    });
  },
};
