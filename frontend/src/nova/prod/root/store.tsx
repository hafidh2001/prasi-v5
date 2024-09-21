import { loadRouter, ProdRouter } from "prod/loader/route";
import { defineStore } from "utils/react/define-store";

export const useProd = defineStore({
  name: "prod-store",
  ref: {
    router: null as null | ProdRouter["router"],
  },
  state: {
    pages: null as null | ProdRouter["pages"],
    status: {
      router: "init" as "init" | "loading" | "ready",
    },
  },
  action: ({ state: s, update, ref: r }) => ({
    init() {
      if (s.status.router === "init") {
        s.status.router = "loading";
        loadRouter().then(({ router, pages }) => {
          update((s) => {
            s.status.router = "ready";
            r.router = router;
            s.pages = pages;
          });
        });
      }
    },
  }),
});
