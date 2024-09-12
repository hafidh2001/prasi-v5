import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/site_load",
  api: async (ctx: ServerCtx) => {
    const [id, opt] = await ctx.req.json();
    return compressed(ctx, await editor.site.load(id, opt));
  },
};
