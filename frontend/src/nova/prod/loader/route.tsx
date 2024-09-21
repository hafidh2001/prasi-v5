import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { createRouter } from "radix3";
import { base } from "./base";

const cached = { route: null as any, promise: null as any };

const loadCachedRoute = () => {
  if (cached.promise) return cached.promise;
  cached.promise = new Promise<{
    site: any;
    urls: {
      id: string;
      url: string;
    }[];
    layout: any;
  }>(async (done) => {
    if (cached.route) done(cached.route);

    const res = await fetch(base.url`_prasi/route`);
    if (!res.headers.get("content-encoding")) {
      fetch(base.url`_prasi/compress/only-gz`);
    }

    cached.route = await res.json();
    done(cached.route);
  });
  return cached.promise;
};

export const loadRouter = async () => {
  const router = createRouter<{ id: string; url: string }>();
  const pages = [] as { id: string; url: string }[];
  try {
    const res = await loadCachedRoute();

    if (res && res.site && res.urls) {
      if (res.layout) {
        base.layout.id = res.layout.id;
        base.layout.root = res.layout.root;
      }

      base.site = res.site;

      base.site.code = { mode: "vsc" };

      base.site.api = apiProxy(base.site.api_url);
      base.site.db = dbProxy(base.site.api_url);

      const w = window as any;
      w.serverurl = base.site.api_url;
      w.db = base.site.db;
      w.api = base.site.api;

      for (const item of res.urls) {
        router.insert(item.url, item);
        pages.push(item);
      }
    }
  } catch (e) {}

  return { router, pages };
};

export type ProdRouter = Awaited<ReturnType<typeof loadRouter>>;
