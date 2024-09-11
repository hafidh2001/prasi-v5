import { devProxy } from "./dev/proxy";
import { devWS } from "./dev/ws";
import { c } from "./utils/color";
import { dir } from "./utils/dir";
import { editor } from "./utils/editor";
import { api } from "./utils/server/api";
import { serverContext } from "./utils/server/ctx";
import { staticFile } from "./utils/static";
import { initWS } from "./ws/init";

import "./utils/init";

const prod = {
  static: await staticFile(dir.data("/prasi-static")),
};
editor.init();
api.init();

const server = Bun.serve({
  port: 4550,
  websocket: g.mode === "dev" ? devWS : initWS,
  async fetch(request, server) {
    const ctx = serverContext(server, request);
    if (ctx.ws) return undefined;

    const apiResponse = await api.serve(ctx);
    if (apiResponse) return apiResponse;

    if (g.mode === "dev") return devProxy(ctx);
    return prod.static.serve(ctx);
  },
});

console.log(
  `${c.green}[${g.mode.toUpperCase()}]${c.esc} Prasi Server ${
    c.blue
  }http://localhost:${server.port}${c.esc}`
);
