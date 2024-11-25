import { type ServerWebSocket, type WebSocketHandler } from "bun";
import type { WSContext } from "../utils/server/ctx";
import { initWS } from "../ws/init";
import { waitUntil } from "prasi-utils";

const clients = {
  conns: new WeakMap<ServerWebSocket<WSContext>, WebSocket>(),
};
const connect = async (ws: ServerWebSocket<WSContext>) => {
  if (!g.rsbuild?.prasi_port) {
    await waitUntil(() => g.rsbuild?.prasi_port);
  }
  const cws = new WebSocket(
    `ws://localhost:${g.rsbuild.prasi_port}${ws.data.pathname}`
  );
  cws.onmessage = ({ data }) => {
    ws.send(data); 
  };
  cws.onclose = () => {
    ws.close();
  };
  return cws;
};

export const devWS: WebSocketHandler<WSContext> = {
  async message(ws, message) {
    if (ws.data.pathname.startsWith("/rsbuild-hmr")) {
      let cws = clients.conns.get(ws);
      if (!cws) {
        cws = await connect(ws);
        clients.conns.set(ws, cws);
      }
      cws.send(message);
    } else {
      initWS.message(ws, message);
    }
  },
  async open(ws) {
    if (ws.data.pathname.startsWith("/rsbuild-hmr")) {
      clients.conns.set(ws, await connect(ws));
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
