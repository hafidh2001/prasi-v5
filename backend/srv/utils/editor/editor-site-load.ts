import { pack, unpack } from "msgpackr";
import type { editor } from ".";
import { rebuildSite } from "../loader/site";
import { loadCache } from "../server/load-cache";

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

  const site = await loadCache({
    is_cached() {
      const res = ed.cache.tables.site.find({ where: { site_id } })[0]?.data;
      if (res) {
        return unpack(res);
      }
      return undefined;
    },
    load() {
      return _db.site.findFirst({ where: { id: site_id } });
    },
    save(result, is_new) {
      let id = undefined;
      if (!is_new) {
        id = ed.cache.tables.site.find({ where: { site_id } })[0].id;
      }
      ed.cache.tables.site.save({
        id,
        data: new Uint8Array(pack(result)),
        site_id,
        ts: Date.now(),
      });
    },
  });

  if (site) {
    await rebuildSite(site.id);
  }

  return site;
};
