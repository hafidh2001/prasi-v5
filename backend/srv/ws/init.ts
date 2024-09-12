import type { WebSocketHandler } from "bun";
import type { WSContext } from "../utils/server/ctx";
import { pack, unpack } from "msgpackr";
import { editor } from "../utils/editor";
import { createId } from "@paralleldrive/cuid2";

export const initWS: WebSocketHandler<WSContext> = {
  message(ws, raw) {
    const msg = unpack(raw as Buffer) as {
      action: "open";
      user_id: string;
    };

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
    }
  },
  open(ws) {},
  close(ws, code, reason) {
    const conn_id = editor.ws.get(ws);
    editor.ws.delete(ws);
    if (conn_id) {
      const conn = editor.conn[conn_id];
      if (conn) {
        editor.user[conn.user_id].delete(conn_id);
      }
      delete editor.conn[conn_id];
    }
  },
};
