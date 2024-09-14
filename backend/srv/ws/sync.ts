import { createId } from "@paralleldrive/cuid2";
import { pack } from "msgpackr";
import { editor } from "../utils/editor";
import type { ServerWebSocket } from "bun";
import type { WSContext } from "../utils/server/ctx";
import { crdt_pages } from "./crdt/page";
import { unregisterCompConnection } from "../utils/editor/editor-comp-util";
import { crdt_comps } from "./crdt/shared";
import type { UndoManager } from "yjs";

export const wsSyncClose = (ws: ServerWebSocket<WSContext>) => {
  const conn_id = editor.ws.get(ws);
  editor.ws.delete(ws);
  if (conn_id) {
    const conn = editor.conn[conn_id];
    if (conn) {
      editor.user[conn.user_id].delete(conn_id);
    }
    delete editor.conn[conn_id];

    unregisterCompConnection(conn_id);
    delete editor.comp.conn_ids[conn_id];
  }
};

export const wsSync = (
  ws: ServerWebSocket<WSContext>,
  msg:
    | { action: "open"; user_id: string }
    | { action: "undo"; page_id?: string; comp_id?: string; count: number }
    | { action: "redo"; page_id?: string; comp_id?: string; count: number }
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
        let undoManager = undefined as undefined | UndoManager;
        if (msg.comp_id) undoManager = crdt_comps[msg.comp_id]?.undoManager;
        if (msg.page_id) undoManager = crdt_pages[msg.page_id]?.undoManager;

        if (undoManager) {
          for (let i = 0; i < msg.count; i++) {
            if (undoManager.undoStack.length > 1) {
              undoManager.undo();
            }
          }
        }
      }
      break;
    case "redo":
      {
        let undoManager = undefined as undefined | UndoManager;
        if (msg.comp_id) undoManager = crdt_comps[msg.comp_id]?.undoManager;
        if (msg.page_id) undoManager = crdt_pages[msg.page_id]?.undoManager;

        if (undoManager) {
          for (let i = 0; i < msg.count; i++) {
            undoManager.redo();
          }
        }
      }
      break;
  }
};
