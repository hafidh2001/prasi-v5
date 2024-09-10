import { editor } from "../utils/editor";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/site_load",
  api: async (ctx: ServerCtx) => {
    const [id] = await ctx.req.json();
    return new Response(JSON.stringify(await editor.site.load(id)));
  },
};
