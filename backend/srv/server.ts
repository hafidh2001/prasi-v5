import { devProxy } from "./dev/proxy";
import { devWS } from "./dev/ws";
import { c } from "./utils/color";
import { editor } from "./utils/editor";
import { api } from "./utils/server/api";
import { serverContext } from "./utils/server/ctx";
import { initWS } from "./ws/init";
import { watch } from "fs";
import "./utils/init";
import { asset } from "./utils/server/asset";
import { dir } from "./utils/dir";
import { existsAsync } from "fs-jetpack";
import { waitUntil } from "prasi-utils";

editor.init();
api.init();
if (g.mode === "dev") {
  const path = dir.data(`/site-static`);
  if (!(await existsAsync(path))) {
    await waitUntil(() => existsAsync(path));
  }
  watch(path, (e, c) => {
    asset.nova.rescan();
  });
}

const server = Bun.serve({
  port: 4550,
  websocket: g.mode === "dev" ? devWS : initWS,
  async fetch(request, server) {
    const ctx = serverContext(server, request);
    if (ctx.ws) return undefined;

    if (ctx.url.pathname.startsWith("/nova")) {
      const res = asset.nova.serve(ctx, { prefix: "/nova" });

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
