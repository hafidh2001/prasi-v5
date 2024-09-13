import { dirAsync } from "fs-jetpack";
import { dir } from "../../utils/dir";
import BunORM from "../../utils/sqlite";

const createSiteCrdtDb = (site_id: string) => {
  return new BunORM(dir.data(`/crdt/site-${site_id}.db`), {
    tables: {
      page_updates: {
        columns: {
          page_id: { type: "TEXT" },
          update: { type: "BLOB" },
          ts: { type: "INTEGER" },
        },
      },
    },
  });
};

export const createSiteCrdt = (site_id: string) => {
  return {
    db: createSiteCrdtDb(site_id),
  };
};

export const crdt_site = {} as Record<
  string,
  ReturnType<typeof createSiteCrdt>
>;
