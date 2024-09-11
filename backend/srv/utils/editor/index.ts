import type { ServerWebSocket } from "bun";
import { pack, unpack } from "msgpackr";
import { unlinkSync } from "node:fs";
import { dir } from "../dir";
import { loadSite } from "../loader/site";
import type { WSContext } from "../server/ctx";
import BunORM from "../sqlite";
import { cacheResolve } from "./cache";

type USER_ID = string;
type CONN_ID = string;
export const editor = {
  db: null as unknown as ReturnType<typeof initCacheDb>,
  loading: {
    route: new Set<string>(),
  },
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
  async route(site_id: string, load: () => Promise<string>) {
    const found = this.db.tables.route.find({ where: { site_id } });
    if (found.length === 0) {
      this.loading.route.add(site_id);
      const data = await load();
      this.db.tables.route.save({ site_id, data, ts: Date.now() });
      this.loading.route.delete(site_id);
      return data;
    }

    if (!this.loading.route.has(site_id)) {
      this.loading.route.add(site_id);
      load().then((data) => {
        this.db.tables.route.save({
          id: found[0].id,
          site_id,
          data,
          ts: Date.now(),
        });
      });
      this.loading.route.delete(site_id);
    }

    return found[0].data;
  },
  site: {
    async load(site_id: string, opt?: { conn_id?: string }) {
      if (opt?.conn_id) {
        const conn = editor.conn[opt.conn_id];
        if (conn) {
          conn.site_id = site_id;
        }
      }

      loadSite(site_id);

      return await cacheResolve({
        cached: () => editor.db.tables.site.find({ where: { site_id } })[0],
        resolve: (cached) => unpack(cached.data),
        load: () => _db.site.findFirst({ where: { id: site_id } }),
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
    unlinkSync(dir.data("editor-cache.db"));
  } catch (e) {}
  return new BunORM(dir.data("editor-cache.db"), {
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
      route: {
        columns: {
          site_id: {
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
