import type { ServerWebSocket } from "bun";
import { dir } from "../dir";
import BunORM from "../sqlite";
import { unlinkSync } from "node:fs";
import type { WSContext } from "../server/ctx";
import { pack, unpack } from "msgpackr";
import { cacheResolve } from "./cache";

type USER_ID = string;
type CONN_ID = string;
export const editor = {
  db: null as unknown as ReturnType<typeof initCacheDb>,
  init() {
    this.db = initCacheDb();
  },
  page: {
    load(page_id: string, opt?: { conn_id?: string }) {
      if (opt?.conn_id) {
        const conn = editor.conn[opt.conn_id];
        if (conn) {
          conn.page_id = page_id;
        }
      }
    },
  },
  site: {
    async load(site_id: string, opt?: { conn_id?: string }) {
      if (opt?.conn_id) {
        const conn = editor.conn[opt.conn_id];
        if (conn) {
          conn.site_id = site_id;
        }
      }

      return await cacheResolve({
        cached: () => editor.db.tables.site.find({ where: { site_id } })[0],
        resolve: (cached) => unpack(cached.data),
        load: () => db.site.findFirst({ where: { id: site_id } }),
        store: (result, cached) => {
          editor.db.tables.site.save({
            id: cached?.id,
            data: pack(result),
            site_id,
            ts: Date.now(),
          });
        },
      });
    },
  },
  ws: new WeakMap<ServerWebSocket<WSContext>, CONN_ID>(),
  conn: {} as Record<
    CONN_ID,
    {
      user_id: string;
      page_id?: string;
      site_id?: string;
      ws: ServerWebSocket<WSContext>;
    }
  >,
  user: {} as Record<USER_ID, Set<CONN_ID>>,
};

const initCacheDb = () => {
  try {
    unlinkSync(dir.data("cache.db"));
  } catch (e) {}
  return new BunORM(dir.data("cache.db"), {
    tables: {
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
      site: {
        columns: {
          site_id: {
            type: "TEXT",
            nullable: false,
          },
          data: {
            type: "BLOB",
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
