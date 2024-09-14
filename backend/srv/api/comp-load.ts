import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/comp_load",
  api: async (ctx: ServerCtx) => {
    const [ids, conn_id] = await ctx.req.json();
    return compressed(ctx, await editor.comp.load(ids, conn_id));
  },
};
