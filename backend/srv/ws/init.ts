import type { WebSocketHandler } from "bun";
import { unpack } from "msgpackr";
import type { WSContext } from "../utils/server/ctx";
import { wsComp, wsCompClose } from "./crdt/comp";
import { wsPage, wsPageClose } from "./crdt/page";
import { wsSync, wsSyncClose } from "./sync";

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
      wsSyncClose(ws);
    } else if (pathname.startsWith("/crdt/page")) {
      wsPageClose(ws);
    } else if (pathname.startsWith("/crdt/comp")) {
      wsCompClose(ws);
    }
  },
};
