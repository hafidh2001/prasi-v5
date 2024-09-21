import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { loadRouter, PageRoute, ProdRouter } from "prod/loader/route";
import { defineStore, rawStore } from "utils/react/define-store";
import { snapshot } from "valtio";
import { IItem } from "../../../utils/types/item";
import { EBaseComp, EPage } from "../../ed/logic/types";
import { base } from "../loader/base";
import { loadPages } from "../loader/page";

export const useProdState = defineStore({
  name: "prod-store",
  ref: {
    router: null as null | ProdRouter["router"],
    api: null as null | ReturnType<typeof apiProxy>,
    db: null as null | ReturnType<typeof dbProxy>,
    pages: [] as PageRoute[],
    timeout: {
      load_comp: null as any,
    },
    promise: {
      load_comp: {} as Record<
        string,
        { promise: Promise<IItem>; resolve: (item: IItem) => void }
      >,
    },
  },
  state: {
    ts: Date.now(),
    pathname: location.pathname,
    page: null as null | PageRoute,
    comps: {} as Record<string, EBaseComp>,
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
      load_comp: {} as Record<string, "init" | "loading">,
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
    loadComp(ids: string[]) {
      for (const id of ids) {
        if (!s.comps[id]) {
          if (!s.status.load_comp[id]) {
            s.status.load_comp[id] = "init";

            if (!r.promise.load_comp[id]) {
              const pending = { resolve: null as any };
              const promise = new Promise<IItem>((resolve) => {
                pending.resolve = resolve;
              });
              r.promise.load_comp[id] = { promise, resolve: pending.resolve };
            }
          }
        }
      }

      clearTimeout(r.timeout.load_comp);
      r.timeout.load_comp = setTimeout(async () => {
        const ids = Object.entries(s.status.load_comp)
          .filter(([_, status]) => {
            if (status === "init") return true;
          })
          .map(([id]) => id);

        update((s) => {
          for (const id of ids) {
            s.status.load_comp[id] = "loading";
          }
        });

        if (ids.length > 0) {
          const res = await fetch(base.url`_prasi/comp`, {
            method: "POST",
            body: JSON.stringify({ ids }),
          });

          const json = await res.json();

          if (typeof json === "object" && json) {
            update((s) => {
              for (const id of ids) {
                if (json[id]) {
                  s.comps[id] = structuredClone(json[id]);
                  if (r.promise.load_comp[id]) {
                    r.promise.load_comp[id].resolve(json[id]);
                  }
                }

                delete r.promise.load_comp[id];
                delete s.status.load_comp[id];
              }
            });
          }
        }
      }, 50);
    },
    loadPage(page: PageRoute) {
      if (s.page?.id !== page.id) {
        s.page = page;
      }

      if (!page.content_tree && !page.loading) {
        page.loading = true;
        loadPages([page.id]).then((result) => {
          update((s) => {
            const tree = result[page.id];
            if (tree && s.page) {
              s.page.content_tree = tree;
              delete s.page.loading;

              if (tree.component_ids) {
                const ids = snapshot(tree.component_ids);
                if (Array.isArray(ids)) {
                  this.loadComp(ids);
                }
              }
            }
          });
        });
      }
    },
  }),
});

export const rawProd = rawStore<typeof useProdState>("prod-store");
