import { createId } from "@paralleldrive/cuid2";
import { pack } from "msgpackr";
import { editor } from "../utils/editor";
import type { ServerWebSocket } from "bun";
import type { WSContext } from "../utils/server/ctx";
import { crdt_pages } from "./crdt/crdt";

export const wsSync = (
  ws: ServerWebSocket<WSContext>,
  msg:
    | { action: "open"; user_id: string }
    | { action: "undo"; page_id: string; count: number }
    | { action: "redo"; page_id: string; count: number }
) => {
  switch (msg.action) {
    case "open":
      {
        const conn_id = createId();
        editor.ws.set(ws, conn_id);
        editor.conn[conn_id] = { ws, user_id: msg.user_id };
        if (!editor.user[msg.user_id]) editor.user[msg.user_id] = new Set();
        editor.user[msg.user_id].add(conn_id);
        ws.send(pack({ action: "connected", conn_id }));
      }
      break;
    case "undo":
      {
        const page = crdt_pages[msg.page_id];
        if (page) {
          for (let i = 0; i < msg.count; i++) {
            if (page.undoManager.undoStack.length > 1) {
              page.undoManager.undo();
            }
          }
        }
      }
      break;
    case "redo":
      {
        const page = crdt_pages[msg.page_id];
        if (page) {
          for (let i = 0; i < msg.count; i++) {
            page.undoManager.redo();
          }
        }
      }
      break;
  }
};
