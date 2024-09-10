import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/_prasi/**",
  api: async (ctx: ServerCtx) => {
    return new Response("");
  },
};
