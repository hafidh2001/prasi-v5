import { type ServerWebSocket, type WebSocketHandler } from "bun";
import type { WSContext } from "../utils/server/ctx";
import { initWS } from "../ws/init";

const clients = {
  conns: new WeakMap<ServerWebSocket<WSContext>, WebSocket>(),
};
const connect = (ws: ServerWebSocket<WSContext>) => {
  const cws = new WebSocket(`ws://localhost:3000${ws.data.pathname}`);
  cws.onmessage = ({ data }) => {
    ws.send(data);
  };
  cws.onclose = () => {
    ws.close();
  };
  return cws;
};

export const devWS: WebSocketHandler<WSContext> = {
  message(ws, message) {
    if (ws.data.pathname.startsWith("/rsbuild-hmr")) {
      let cws = clients.conns.get(ws);
      if (!cws) {
        cws = connect(ws);
        clients.conns.set(ws, cws);
      }
      cws.send(message);
    } else {
      initWS.message(ws, message);
    }
  },
  open(ws) {
    if (ws.data.pathname.startsWith("/rsbuild-hmr")) {
      clients.conns.set(ws, connect(ws));
    } else {
      initWS.open?.(ws);
    }
  },
  close(ws, code, reason) {
    if (ws.data.pathname.startsWith("/rsbuild-hmr")) {
      const cws = clients.conns.get(ws);
      if (cws) cws.close();
      clients.conns.delete(ws);
    } else {
      initWS.close?.(ws, code, reason);
    }
  },
};
