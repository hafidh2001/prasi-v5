import { devProxy } from "./dev/proxy";
import { devWS } from "./dev/ws";
import { c } from "./utils/color";
import { editor } from "./utils/editor";
import { api } from "./utils/server/api";
import { serverContext } from "./utils/server/ctx";
import { initWS } from "./ws/init";

import "./utils/init";
import { asset } from "./utils/server/asset";

editor.init();
api.init();

const server = Bun.serve({
  port: 4550,
  websocket: g.mode === "dev" ? devWS : initWS,
  async fetch(request, server) {
    const ctx = serverContext(server, request);
    if (ctx.ws) return undefined;

    if (ctx.url.pathname.startsWith("/static")) {
      const res = asset.nova.serve(ctx);

      if (res) return res;
      return new Response("");
    }

    const apiResponse = await api.serve(ctx);
    if (apiResponse) return apiResponse;

    if (g.mode === "dev") return devProxy(ctx);
    return asset.prasi.serve(ctx);
  },
});

console.log(
  `${c.green}[${g.mode.toUpperCase()}]${c.esc} Prasi Server ${
    c.blue
  }http://localhost:${server.port}${c.esc}`
);
