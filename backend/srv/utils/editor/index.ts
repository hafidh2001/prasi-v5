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
  loading: {} as Record<string, Set<string>>,
  init() {
    this.db = initCacheDb();
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
  page: {
    async load(page_id: string, opt?: { conn_id?: string }) {
      if (opt?.conn_id) {
        const conn = editor.conn[opt.conn_id];
        if (conn) {
          conn.page_id = page_id;
        }
      }

      return await cacheResolve({
        cached: () => editor.db.tables.page.find({ where: { page_id } })[0],
        resolve: (cached) => unpack(cached.root),
        load: () =>
          _db.page.findFirst({
            where: { id: page_id, is_deleted: false },
            select: {
              id: true,
              id_folder: true,
              created_at: true,
              id_layout: true,
              id_site: true,
              is_default_layout: true,
              name: true,
              url: true,
              updated_at: true,
            },
          }),
        store: (result, cached) => {
          editor.db.tables.page.save({
            id: cached?.id,
            root: pack(result),
            page_id,
            ts: Date.now(),
          });
        },
      });
    },
  },
  cache: {
    async route(site_id: string, load: () => Promise<string>) {
      return await editor.cache_get_set("route", site_id, load);
    },
    async loadjs(pathname: string, load: () => Promise<string>) {
      return await editor.cache_get_set("loadjs", pathname, load);
    },
  },
  async cache_get_set(
    prefix: string,
    key: string,
    load: () => Promise<string>
  ) {
    if (!this.loading[prefix]) {
      this.loading[prefix] = new Set<string>();
    }

    const found = this.db.tables.cache.find({ where: { key, prefix } });
    if (found.length === 0) {
      this.loading[prefix].add(key);
      const data = await load();
      this.db.tables.cache.save({ key, prefix, data, ts: Date.now() });
      this.loading[prefix].delete(key);
      return data;
    }

    if (!this.loading[prefix].has(key)) {
      this.loading[prefix].add(key);
      load().then((data) => {
        this.db.tables.cache.save({
          id: found[0].id,
          key,
          prefix,
          data,
          ts: Date.now(),
        });
      });
      this.loading[prefix].delete(key);
    }

    return found[0].data;
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
