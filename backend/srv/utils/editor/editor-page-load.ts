import { pack, unpack } from "msgpackr";
import { cacheResolve } from "../server/cache-resolve";
import type { editor } from ".";

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

  return await cacheResolve({
    cached: () => ed.cache.tables.page.find({ where: { page_id } })[0],
    resolve: (cached) => unpack(cached.root),
    load: () => {
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
    store: (result, cached) => {
      ed.cache.tables.page.save({
        id: cached?.id,
        root: new Uint8Array(pack(result)),
        page_id,
        ts: Date.now(),
      });
    },
  });
};
