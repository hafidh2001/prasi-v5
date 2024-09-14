import { pack, unpack } from "msgpackr";
import type { editor } from ".";
import { loadSite } from "../loader/site";
import { cacheResolve } from "../server/cache-resolve";

export const editorSiteLoad = async (
  ed: typeof editor,
  site_id: string,
  opt?: { conn_id?: string }
) => {
  if (opt?.conn_id) {
    const conn = ed.conn[opt.conn_id];
    if (conn) {
      conn.site_id = site_id;
    }
  }

  loadSite(site_id);

  return await cacheResolve({
    cached: () => ed.cache.tables.site.find({ where: { site_id } })[0],
    resolve: (cached) => unpack(cached.data),
    load: () => _db.site.findFirst({ where: { id: site_id } }),
    store: (result, cached) => {
      ed.cache.tables.site.save({
        id: cached?.id,
        data: pack(result),
        site_id,
        ts: Date.now(),
      });
    },
  });
};
