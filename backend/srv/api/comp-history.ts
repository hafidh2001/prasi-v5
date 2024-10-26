import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";
import { crdt_comps } from "../ws/crdt/shared";

export default {
  url: "/comp_history",
  api: async (ctx: ServerCtx) => {
    const [comp_id] = await ctx.req.json();

    const comp = crdt_comps[comp_id];
    if (comp) {
      return compressed(ctx, {
        undo: comp.undoManager.undoStack.map((e) => {
          return {
            ts: (e as any).ts,
            size: formatBytes(JSON.stringify(e).length),
          };
        }),
        redo: comp.undoManager.redoStack.map((e) => {
          return {
            ts: (e as any).ts,
            size: formatBytes(JSON.stringify(e).length),
          };
        }),
        history: comp.actionHistory,
        ts: Date.now(),
      });
    }
    return compressed(ctx, ["-"]);
  },
};

function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return "0 B";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
