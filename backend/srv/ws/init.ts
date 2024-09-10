import type { WebSocketHandler } from "bun";
import type { WSContext } from "../utils/server/ctx";

export const initWS: WebSocketHandler<WSContext> = {
  message(ws, message) {},
  open(ws) {
    console.log(ws.data);
  },
};
