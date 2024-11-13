import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/comp_ext/:comp_id/:action",
  api: async ({ req, params }: ServerCtx) => {
    if (params.comp_id && params.action === "reset") {
      const comp = await _db.component_ext.findFirst({
        where: { id_component: params.comp_id },
        select: { id: true },
      });

      if (comp) {
        await _db.component_ext.delete({
          where: { id: comp.id },
        });
      }
    }

    return new Response("ok");
  },
};
