import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/_dbs/**",
  api: async (ctx: ServerCtx) => {
    return new Response("");
  },
};
