import { xxhash32 } from "hash-wasm";
import { UseStore, get, set } from "idb-keyval";
import { pack, Packr } from "msgpackr";
import { ESite } from "../../nova/ed/logic/ed-global";
import { w } from "../types/general";
import { site } from "prasi-db";
const packr = new Packr({ structuredClone: true });

/** CONSTANT */
const WS_CONFIG = {
  debug: !!localStorage.getItem("prasi-ws-debug"),
  reconnectTimeout: 1000,
};

w.debug = new Proxy(
  {},
  {
    get(target, p, receiver) {
      if (p === "off") {
        WS_CONFIG.debug = false;
        localStorage.removeItem("prasi-js-debug");
        localStorage.removeItem("prasi-ws-debug");
        console.clear();
        return ["WS DEBUG: Deactivated"];
      }
      if (p === "on") {
        WS_CONFIG.debug = true;
        localStorage.setItem("prasi-ws-debug", "1");
        console.clear();
        return ["WS DEBUG: Activated"];
      }
      if (p === "js") {
        localStorage.setItem("prasi-js-debug", "1");
        console.clear();
        return ["JS DEBUG: Activated"];
      }
    },
  }
) as any;

const sendWs = (ws: WebSocket, msg: any) => {
  const raw = packr.pack(msg);
  if (WS_CONFIG.debug)
    console.log(`%c⬆`, "color:blue", formatBytes(raw.length, 0), msg);
  ws.send(raw);
};

export const clientStartSync = (arg: {
  user_id: string;
  site_id?: string;
  page_id?: string;
}) => {
  return new Promise<ReturnType<typeof createClient>>((done) => {
    const url = new URL(location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/sync";
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(pack({ action: "open", user_id: arg.user_id }));
    };
    ws.onmessage = ({ data }) => {};
    ws.onclose = () => {};
    done(createClient(ws));
  });
};

const createClient = (ws: WebSocket) => ({
  site: {
    load: async (id: string) => {
      const site = null as unknown as ESite;

      const res = await _api.site_load(id);
      console.log(res);

      return site;
    },
  },
  code: {
    action: async () => {},
  },
});

function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
