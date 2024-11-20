import { validate } from "uuid";
import type { ServerCtx } from "../utils/server/ctx";
import { pack } from "msgpackr";
import { compressed } from "../utils/server/compressed";

export default {
  url: "/_cprasi",
  api: async (ctx: ServerCtx) => {
    const [page_id, body] = (await ctx.req.json()) as [
      string,
      { exclude?: string[] },
    ];
    if (validate(page_id)) {
      const page = await _db.page.findFirst({
        where: { id: page_id },
        select: { content_tree: true },
      });

      let comps: any[] = [];
      if (page) {
        const pending_ids =
          (page.content_tree as any).component_ids ||
          ([] as string[]).filter((e) => {
            if (body.exclude && body.exclude.includes(e)) return false;
            return true;
          });

        if (pending_ids.length > 0) {
          comps = await _db.component.findMany({
            where: {
              id: {
                in: pending_ids,
              },
              deleted_at: null,
            },
            select: { id: true, content_tree: true },
          });
        }
      }
      return compressed(ctx, { page, comps });
    }

    return new Response("");
  },
};
