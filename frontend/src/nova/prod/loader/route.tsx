import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { createRouter } from "radix3";
import { base } from "./base";
import { EPage } from "../../ed/logic/types";

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

export type PageRoute = {
  id: string;
  url: string;
  content_tree?: EPage["content_tree"];
  loading?: true;
};

export const loadRouter = async () => {
  const router = createRouter<{
    id: string;
    url: string;
    content_tree?: EPage["content_tree"];
  }>();
  const pages = [] as PageRoute[];
  let site = {
    id: "",
    name: "",
    domain: "",
    responsive: "all",
    api_url: "",
  };
  let layout = { id: "", root: null as null | EPage["content_tree"] };
  try {
    const res = await loadCachedRoute();

    if (res && res.site && res.urls) {
      site = res.site;
      layout = res.layout;

      for (const item of res.urls) {
        router.insert(item.url, item);
        pages.push(item);
      }
    }
  } catch (e) {}

  return { router, pages, site, layout };
};

export type ProdRouter = Awaited<ReturnType<typeof loadRouter>>;
