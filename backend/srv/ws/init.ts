import type { WebSocketHandler } from "bun";
import { unpack } from "msgpackr";
import { editor } from "../utils/editor";
import type { WSContext } from "../utils/server/ctx";
import { wsSync } from "./sync";
import { wsPage, wsPageClose } from "./crdt/page";
import { wsComp, wsCompClose } from "./crdt/comp";

export const initWS: WebSocketHandler<WSContext> = {
  message(ws, raw) {
    const pathname = ws.data.pathname;
    if (pathname.startsWith("/sync")) {
      wsSync(ws, unpack(raw as Buffer));
    } else if (pathname.startsWith("/crdt/page")) {
      wsPage(ws, raw as Buffer);
    } else if (pathname.startsWith("/crdt/comp")) {
      wsComp(ws, raw as Buffer);
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
    } else if (pathname.startsWith("/crdt/page")) {
      wsPageClose(ws);
    } else if (pathname.startsWith("/crdt/comp")) {
      wsCompClose(ws);
    }
  },
};
