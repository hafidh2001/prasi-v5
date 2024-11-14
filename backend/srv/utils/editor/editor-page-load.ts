import { pack, unpack } from "msgpackr";
import type { editor } from ".";
import { loadCache } from "../server/load-cache";

export const editorPageLoad = async (
  ed: typeof editor,
  page_id: string,
  opt?: { conn_id?: string }
) => {
  if (opt?.conn_id) {
    const conn = ed.conn[opt.conn_id];
    if (conn) {
      conn.page_id = page_id;
    }
  }

  const page = await loadCache({
    is_cached() {
      const res = ed.cache.tables.page.find({ where: { page_id } });
      if (res && Array.isArray(res) && !!res[0]) {
        return unpack(res[0].root);
      }
      return undefined;
    },
    load() {
      return _db.page.findFirst({
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
      });
    },
    save(data, is_new) {
      let id = undefined;
      if (!is_new) {
        id = ed.cache.tables.page.find({ where: { page_id } })[0].id;
      }
      ed.cache.tables.page.save({
        id,
        root: new Uint8Array(pack(data)),
        page_id,
        ts: Date.now(),
      });
    },
  });
  return page;
};
