import { editor } from "../utils/editor";
import { compressed } from "../utils/server/compressed";
import type { ServerCtx } from "../utils/server/ctx";
import { crdt_pages } from "../ws/crdt/crdt";

export default {
  url: "/page_history",
  api: async (ctx: ServerCtx) => {
    const [page_id] = await ctx.req.json();

    const page = crdt_pages[page_id];
    if (page) {
      return compressed(ctx, {
        undo: page.undoManager.undoStack.map((e) => {
          return { ts: (e as any).ts, size: formatBytes(JSON.stringify(e).length) };
        }),
        redo: page.undoManager.redoStack.map((e) => {
          return { ts: (e as any).ts, size: formatBytes(JSON.stringify(e).length) };
        }),
        ts: Date.now(),
      });
    }
    return compressed(ctx, ["123123"]);
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