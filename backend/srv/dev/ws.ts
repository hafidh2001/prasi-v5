import { type ServerWebSocket, type WebSocketHandler } from "bun";
import type { WSContext } from "../utils/server/ctx";

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
    let cws = clients.conns.get(ws);
    if (!cws) {
      cws = connect(ws);
      clients.conns.set(ws, cws);
    }
    cws.send(message);
  },
  open(ws) {
    clients.conns.set(ws, connect(ws));
  },
  close(ws, code, reason) {
    const cws = clients.conns.get(ws);
    if (cws) cws.close();
    clients.conns.delete(ws);
  },
};
