import type { ServerWebSocket } from "bun";
import { dirAsync } from "fs-jetpack";
import { Awareness } from "y-protocols/awareness.js";
import { Doc, UndoManager } from "yjs";
import { dir } from "../../utils/dir";
import type { WSContext } from "../../utils/server/ctx";
import BunORM from "../../utils/sqlite";

const createPageDb = (site_id: string) => {
  return new BunORM(dir.data(`/crdt/site/${site_id}/page.db`), {
    tables: {
      page_updates: {
        columns: {
          page_id: { type: "TEXT" },
          action: { type: "TEXT" },
          update: { type: "BLOB" },
          ts: { type: "INTEGER" },
        },
      },
    },
  });
};

export const createSiteCrdt = async (site_id: string) => {
  await dirAsync(dir.data(`/crdt/site/${site_id}`));

  return {
    page: createPageDb(site_id),
  };
};

export const crdt_pages = {} as Record<
  string,
  {
    doc: Doc;
    url: string;
    awareness: Awareness;
    undoManager: UndoManager;
    actionHistory: Record<number, string>;
    timeout: any;
    ws: Set<ServerWebSocket<WSContext>>;
  }
>;

export const crdt_comps = {} as Record<
  string,
  {
    doc: Doc;
    awareness: Awareness;
    undoManager: UndoManager;
    actionHistory: Record<number, string>;
    timeout: any;
    ws: Set<ServerWebSocket<WSContext>>;
  }
>;

export const crdt_site = {} as Record<
  string,
  Awaited<ReturnType<typeof createSiteCrdt>>
>;
