import { loadRouter, ProdRouter, PageRoute } from "prod/loader/route";
import { defineStore, rawStore } from "utils/react/define-store";
import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { EPage } from "../../ed/logic/types";
import { loadPages } from "../loader/page";

export const useProd = defineStore({
  name: "prod-store",
  ref: {
    router: null as null | ProdRouter["router"],
    api: null as null | ReturnType<typeof apiProxy>,
    db: null as null | ReturnType<typeof dbProxy>,
    pages: [] as PageRoute[],
  },
  state: {
    pathname: location.pathname,
    page: null as null | PageRoute,
    site: {
      id: "",
      name: "",
      domain: "",
      responsive: "all",
      api_url: "",
    },
    layout: { id: "", root: null as null | EPage["content_tree"] },
    status: {
      router: "init" as "init" | "loading" | "ready",
      responsive: "desktop" as "mobile" | "desktop",
    },
  },
  action: ({ state: s, update, ref: r }) => ({
    initRouter() {
      if (s.status.router === "init") {
        s.status.router = "loading";
        loadRouter().then(({ router, pages, site, layout }) => {
          update((s) => {
            s.site = site;
            s.layout = layout;
            r.router = router;
            r.pages = pages;

            if (site.api_url) {
              r.api = apiProxy(site.api_url);
              r.db = dbProxy(site.api_url);
            }
            s.status.router = "ready";
          });
        });
      }
    },
    loadPage(page: PageRoute) {
      if (s.page?.id !== page.id) {
        s.page = page;
      }

      if (!page.root && !page.loading) {
        page.loading = true;
        loadPages([page.id]).then((result) => {
          update((s) => {
            const tree = result[page.id];
            if (tree && s.page) {
              s.page.root = tree;
              delete s.page.loading;
            }
          });
        });
      }
    },
  }),
});

export const rawProd = rawStore<typeof useProd>("prod-store");
