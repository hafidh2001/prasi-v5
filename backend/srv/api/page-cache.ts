import { editor } from "../utils/editor";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/page_cache",
  api: async (ctx: ServerCtx) => {
    const [{ page_id, action }] = await ctx.req.json();
    if (action === "reload") {
      editor.cache.tables.page.delete({ where: { page_id } });
      await editor.page.load(page_id);
    }
    return new Response("ok");
  },
};
