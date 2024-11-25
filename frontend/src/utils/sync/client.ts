import { pack, unpack } from "msgpackr";
import { PG } from "../../nova/ed/logic/ed-global";
import { EBaseComp, EPage, ESite } from "../../nova/ed/logic/types";
import { WSReceiveMsg } from "./type";

export const clientStartSync = (arg: {
  p: PG;
  user_id: string;
  site_id: string;
  page_id?: string;
  siteLoaded: (sync: ReturnType<typeof createClient>) => void;
}) => {
  const p = arg.p;
  p.sync = undefined;
  const reconnect = () => {
    const url = new URL(location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/sync";
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(
        pack({ action: "open", user_id: arg.user_id, site_id: arg.site_id })
      );
      p.ui.site.build_log = [];
    };

    ws.onmessage = async ({ data }) => {
      if (data instanceof Blob) {
        const msg = unpack(
          new Uint8Array(await data.arrayBuffer())
        ) as WSReceiveMsg;
        if (msg.action === "connected") {
          console.log("🚀 Prasi Connected");
          if (p.sync) {
            p.sync.ws = ws;
            p.sync.ping = setInterval(() => {
              ws.send(pack({ action: "ping" }));
            }, 90 * 1000);
            p.render();
          } else {
            p.sync = createClient(ws, p, msg.conn_id);
          }
        } else if (msg.action === "site-loading") {
          p.ui.site.loading_status = msg.status;
          p.render();
        } else if (msg.action === "site-build-log") {
          if (msg.action.length > 2) {
            p.ui.site.build_log.shift();
          }
          p.ui.site.build_log.push(msg.log);
          p.render();
        } else if (msg.action === "site-ready") {
          if (p.sync) {
            p.site = msg.site;
            arg.siteLoaded(p.sync);
          }
        }
      }
    };
    ws.onclose = () => {
      p.render();
      if (p.sync?.ping) clearTimeout(p.sync.ping);
      setTimeout(() => {
        reconnect();
      }, 3000);
    };
  };
  reconnect();
};

const send = (ws: WebSocket, msg: any) => {
  if (ws.readyState === ws.OPEN) {
    ws.send(pack(msg));
  }
};

export const createClient = (ws: WebSocket, p: any, conn_id: string) => ({
  conn_id,
  ws,
  ping: null as null | Timer,
  comp: {
    undo: (comp_id: string, count: number) => {
      send(ws, { action: "undo", comp_id, count });
    },
    redo: (comp_id: string, count: number) => {
      send(ws, { action: "redo", comp_id, count });
    },
    load: async (ids: string[]) => {
      return (await _api.comp_load(ids, p.user.conn_id)) as Record<
        string,
        EBaseComp
      >;
    },
    pending_action: (comp_id: string, action_name: string) => {
      send(ws, { action: "pending_action", comp_id, action_name });
    },
  },
  page: {
    undo: (page_id: string, count: number) => {
      send(ws, { action: "undo", page_id, count });
    },
    redo: (page_id: string, count: number) => {
      send(ws, { action: "redo", page_id, count });
    },
    load: async (id: string) => {
      return (await _api.page_load(id, { conn_id: p.user.conn_id })) as Omit<
        EPage,
        "content_tree"
      >;
    },
    pending_action: (page_id: string, action_name: string) => {
      send(ws, { action: "pending_action", page_id, action_name });
    },
  },
});
