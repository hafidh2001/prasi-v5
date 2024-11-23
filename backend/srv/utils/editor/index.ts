import type { ServerWebSocket } from "bun";
import { dir } from "../dir";
import type { WSContext } from "../server/ctx";
import BunORM from "../sqlite";
import { editorCompLoad } from "./editor-comp-load";
import {
  registerCompConnections,
  unregisterCompConnection,
} from "./editor-comp-util";
import { editorPageLoad } from "./editor-page-load";
import type { WSReceiveMsg } from "prasi-frontend/src/utils/sync/type";
import { pack } from "msgpackr";

type USER_ID = string;
type SITE_ID = string;
type CONN_ID = string;

export const editor = {
  cache: null as unknown as ReturnType<typeof initCacheDb>,
  init() {
    this.cache = initCacheDb();
  },
  comp: {
    comp_ids: {} as Record<string, Set<CONN_ID>>,
    conn_ids: {} as Record<CONN_ID, Set<string>>,
    async load(comp_ids: string[], conn_id: string) {
      registerCompConnections(comp_ids, conn_id);
      return await editorCompLoad(comp_ids);
    },
    pending_action: {} as Record<string, string[]>,
    timeout_action: {} as Record<string, any>,
  },
  page: {
    async load(page_id: string, opt?: { conn_id?: string }) {
      if (opt?.conn_id) unregisterCompConnection(opt.conn_id);
      const result = await editorPageLoad(editor, page_id, opt);
      return result;
    },
    pending_action: {} as Record<string, string[]>,
    timeout_action: {} as Record<string, any>,
  },
  ws: new WeakMap<ServerWebSocket<WSContext>, CONN_ID>(),
  conn: {} as Record<
    CONN_ID,
    {
      user_id: string;
      page_id?: string;
      site_id: string;
      ws: ServerWebSocket<WSContext>;
    }
  >,
  site: {} as Record<SITE_ID, Set<CONN_ID>>,
  user: {} as Record<USER_ID, Set<CONN_ID>>,
  load_cached: (arg: {
    type: "route" | "prasi-load-js";
    key: string;
    loader: () => Promise<any>;
  }) => {
    const { type, key, loader } = arg;
    return editor.internal.cache_get_set(type, key, loader);
  },
  broadcast(receiver: Partial<{ site_id: string }>, msg: WSReceiveMsg) {
    if (receiver.site_id) {
      const conns = editor.site[receiver.site_id];
      if (conns) {
        for (const conn_id of conns) {
          const conn = editor.conn[conn_id];
          if (conn) {
            conn.ws.send(new Uint8Array(pack(msg)));
          }
        }
      }
    }
  },

  // #region internal
  internal: {
    loading: {} as Record<string, Set<string>>,
    async cache_get_set(
      prefix: string,
      key: string,
      load: () => Promise<string>
    ) {
      if (!editor.internal.loading[prefix]) {
        editor.internal.loading[prefix] = new Set<string>();
      }

      const found = editor.cache.tables.cache.find({ where: { key, prefix } });
      if (found.length === 0) {
        editor.internal.loading[prefix].add(key);
        const data = await load();
        editor.cache.tables.cache.save({ key, prefix, data, ts: Date.now() });
        editor.internal.loading[prefix].delete(key);
        return data;
      }

      if (!editor.internal.loading[prefix].has(key)) {
        editor.internal.loading[prefix].add(key);
        load().then((data) => {
          editor.cache.tables.cache.save({
            id: found[0].id,
            key,
            prefix,
            data,
            ts: Date.now(),
          });
        });
        editor.internal.loading[prefix].delete(key);
      }

      return found[0].data;
    },
  },
  // #endregion
};

//#region init-cache-db
const initCacheDb = () => {
  return new BunORM(dir.data("editor-cache.db"), {
    tables: {
      comp: {
        columns: {
          comp_id: {
            type: "TEXT",
            nullable: false,
          },
          data: {
            type: "JSON",
            nullable: false,
          },
          ts: {
            type: "INTEGER",
            nullable: false,
          },
        },
      },
      page: {
        columns: {
          page_id: {
            type: "TEXT",
            nullable: false,
          },
          root: {
            type: "BLOB",
            nullable: false,
          },
          ts: {
            type: "INTEGER",
            nullable: false,
          },
        },
      },
      cache: {
        columns: {
          prefix: {
            type: "TEXT",
            nullable: false,
          },
          key: {
            type: "TEXT",
            nullable: false,
          },
          data: {
            type: "TEXT",
            nullable: false,
          },
          ts: {
            type: "INTEGER",
            nullable: false,
          },
        },
      },
    },
  });
};
//#endregion
