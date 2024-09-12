import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";
import { crdt_pages } from "../ws/crdt";

export default {
  url: "/page_history",
  api: async (ctx: ServerCtx) => {
    const [page_id] = await ctx.req.json();

    const page = crdt_pages[page_id];
    if (page) {
      return compressed(ctx, {
        undo: page.undoManager.undoStack.map((e) => (e as any).ts),
        redo: page.undoManager.redoStack.map((e) => (e as any).ts),
        ts: Date.now(),
      });
    }
    return compressed(ctx, ["123123"]);
  },
};
