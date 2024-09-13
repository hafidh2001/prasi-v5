import { pack, unpack } from "msgpackr";
import { PG } from "../../nova/ed/logic/ed-global";
import { EPage, ESite } from "../../nova/ed/logic/types";

export const clientStartSync = (arg: {
  p: PG;
  user_id: string;
  site_id?: string;
  page_id?: string;
}) => {
  arg.p.sync = undefined;
  return new Promise<ReturnType<typeof createClient>>((done) => {
    const url = new URL(location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/sync";
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(pack({ action: "open", user_id: arg.user_id }));
      setInterval(() => {
        if (ws.ping) {
          ws.ping();
        } else {
          console.log(ws.ping);
        }
      }, 90 * 1000);
    };
    ws.onmessage = async ({ data }) => {
      if (data instanceof Blob) {
        const msg = unpack(new Uint8Array(await data.arrayBuffer())) as {
          action: "connected";
          conn_id: string;
        };
        if (msg.action === "connected") {
          done(createClient(ws, arg.p, msg.conn_id));
        }
      }
    };
    ws.onclose = () => {};
  });
};

export const createClient = (ws: WebSocket, p: any, conn_id: string) => ({
  conn_id,
  ws,
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
  page: {
    undo: (page_id: string, count: number) => {
      ws.send(pack({ action: "undo", page_id, count }));
    },
    redo: (page_id: string, count: number) => {
      ws.send(pack({ action: "redo", page_id, count }));
    },
    load: async (id: string) => {
      return (await _api.page_load(id, { conn_id: p.user.conn_id })) as EPage;
    },
  },
});
