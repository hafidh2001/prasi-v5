import { pack, unpack } from "msgpackr";
import { PG } from "../../nova/ed/logic/ed-global";
import { EBaseComp, EPage, ESite } from "../../nova/ed/logic/types";

export const clientStartSync = (arg: {
  p: PG;
  user_id: string;
  site_id?: string;
  page_id?: string;
  connected: (sync: ReturnType<typeof createClient>) => void;
}) => {
  arg.p.sync = undefined;
  const reconnect = () => {
    const url = new URL(location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/sync";
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(pack({ action: "open", user_id: arg.user_id }));
    };

    ws.onmessage = async ({ data }) => {
      if (data instanceof Blob) {
        const msg = unpack(new Uint8Array(await data.arrayBuffer())) as {
          action: "connected";
          conn_id: string;
        };
        if (msg.action === "connected") {
          if (arg.p.sync) {
            arg.p.sync.ws = ws;
            arg.p.sync.ping = setInterval(() => {
              ws.send(pack({ action: "ping" }));
            }, 90 * 1000);
            arg.p.render();
          } else {
            arg.connected(
              createClient(
                ws,
                arg.p,
                msg.conn_id,
                setInterval(() => {
                  ws.send(pack({ action: "ping" }));
                }, 90 * 1000)
              )
            );
          }
        }
      }
    };
    ws.onclose = () => {
      arg.p.render();
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

export const createClient = (
  ws: WebSocket,
  p: any,
  conn_id: string,
  ping: any
) => ({
  conn_id,
  ws,
  ping,
  site: {
    load: async (id: string) => {
      return (await _api.site_load(id, { conn_id: p.user.conn_id })) as ESite;
    },
    group: async () => {
      return [] as {
        id: string;
        name: string;
        site: ESite[];
        org_user: { user: { id: string; username: string } }[];
      }[];
    },
  },
  code: {
    action: async () => {},
  },
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
