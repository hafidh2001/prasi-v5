import { addRoute, createRouter, findRoute } from "rou3";
import type { ServerCtx } from "./ctx";
import { apiDefinition } from "../../api";

export const api = {
  router: createRouter<{ fn: (...arg: any[]) => Promise<any> }>(),
  init() {
    for (const item of apiDefinition) {
      addRoute(api.router, undefined, item.default.url, {
        fn: item.default.api,
      });
    }
  },
  serve: async (ctx: ServerCtx) => {
    const found = findRoute(api.router, undefined, ctx.url.pathname);
    if (found) {
      ctx.params = found.params;
      return await found.data.fn(ctx);
    }
    return undefined;
  },
};
