import type { WebSocketHandler } from "bun";
import { unpack } from "msgpackr";
import { editor } from "../utils/editor";
import type { WSContext } from "../utils/server/ctx";
import { wsSync } from "./sync";
import { wsCrdt, wsCrdtClose } from "./crdt";

export const initWS: WebSocketHandler<WSContext> = {
  message(ws, raw) {
    const pathname = ws.data.pathname;
    if (pathname.startsWith("/sync")) {
      wsSync(ws, unpack(raw as Buffer));
    } else if (pathname.startsWith("/crdt")) {
      wsCrdt(ws, raw as Buffer);
    }
  },
  open(ws) {},
  close(ws, code, reason) {
    const pathname = ws.data.pathname;
    if (pathname.startsWith("/sync")) {
      const conn_id = editor.ws.get(ws);
      editor.ws.delete(ws);
      if (conn_id) {
        const conn = editor.conn[conn_id];
        if (conn) {
          editor.user[conn.user_id].delete(conn_id);
        }
        delete editor.conn[conn_id];
      }
    } else if (pathname.startsWith("/crdt")) {
      wsCrdtClose(ws);
    }
  },
};
