import type { ServerWebSocket } from "bun";
import { dirAsync } from "fs-jetpack";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { bind } from "prasi-frontend/src/nova/ed/crdt/lib/immer-yjs";
import { applyAwarenessUpdate, Awareness } from "y-protocols/awareness.js";
import * as syncProtocol from "y-protocols/sync.js";
import { readSyncMessage } from "y-protocols/sync.js";
import { applyUpdate, Doc, encodeStateAsUpdate, UndoManager } from "yjs";
import { dir } from "../../utils/dir";
import type { WSContext } from "../../utils/server/ctx";
import { crdt_site, createSiteCrdt } from "./crdt-site";
import { encode, pack, unpack } from "msgpackr";

export const crdt_pages = {} as Record<
  string,
  {
    doc: Doc;
    awareness: Awareness;
    undoManager: UndoManager;
    timeout: any;
    ws: Set<ServerWebSocket<WSContext>>;
  }
>;

enum MessageType {
  Sync = 0,
  Awareness = 1,
}

export const wsCrdtClose = (ws: ServerWebSocket<WSContext>) => {
  const page_id = ws.data.pathname.substring(`/crdt/page-`.length);
  const page = crdt_pages[page_id];
  if (page) {
    page.ws.delete(ws);
  }
};

export const wsCrdt = async (ws: ServerWebSocket<WSContext>, raw: Buffer) => {
  const page_id = ws.data.pathname.substring(`/crdt/page-`.length);
  if (!crdt_pages[page_id]) {
    const db_page = await _db.page.findFirst({
      where: { id: page_id },
      select: { content_tree: true, id_site: true },
    });
    if (!db_page) return;

    const site_id = db_page!.id_site;
    if (site_id && !crdt_site[site_id]) {
      await dirAsync(dir.data(`/crdt`));
      crdt_site[site_id] = createSiteCrdt(site_id);
    }
    const site = crdt_site[site_id];

    const doc = new Doc();
    const data = doc.getMap("data");
    const immer = bind<any>(data);

    let undoManager: UndoManager | undefined;
    const updates = site.db.tables.page_updates.find({
      where: { page_id },
      sort: { ts: "asc" },
    });
    if (updates.length > 0) {
      undoManager = new UndoManager(data, { captureTimeout: 0 });

      for (const d of updates) {
        applyUpdate(doc, d.update);
      }
    } else {
      immer.update(() => db_page?.content_tree);
      const update = encodeStateAsUpdate(doc);
      site.db.tables.page_updates.save({ page_id, update, ts: Date.now() });
      undoManager = new UndoManager(data);
    }
    undoManager.captureTimeout = 200;

    if (undoManager) {
      const awareness = new Awareness(doc);
      awareness.setLocalState(null);

      undoManager.on("stack-item-added", (opt) => {
        (opt.stackItem as any).ts = Date.now();
      });

      crdt_pages[page_id] = {
        undoManager,
        doc,
        awareness,
        timeout: null,
        ws: new Set(),
      };
    }

    doc.on("update", (update, origin) => {
      const page = crdt_pages[page_id];
      if (page) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MessageType.Sync);
        syncProtocol.writeUpdate(encoder, update);
        const message = encoding.toUint8Array(encoder);
        page.ws.forEach((w) => w.send(message));

        if (origin === undoManager) {
          if (undoManager.undoing) {
            const count = site.db.tables.page_updates.count({
              where: { page_id },
            });

            if (count > 1) {
              site.db.tables.page_updates.delete({
                where: { page_id },
                sort: { ts: "desc" },
                limit: 1,
              });
            }
          }

          if (undoManager.redoing) {
            site.db.tables.page_updates.save({
              page_id,
              update: encodeStateAsUpdate(doc),
              ts: Date.now(),
            });
          }
        } else {
          site.db.tables.page_updates.save({ page_id, update, ts: Date.now() });
        }
      }
    });
  }

  const { doc, awareness, ws: page_ws } = crdt_pages[page_id];

  page_ws.add(ws);
  const encoder = encoding.createEncoder();
  const decoder = decoding.createDecoder(raw);
  const messageType = decoding.readVarUint(decoder);

  switch (messageType) {
    case MessageType.Sync:
      encoding.writeVarUint(encoder, MessageType.Sync);
      readSyncMessage(decoder, encoder, doc, null);

      if (encoding.length(encoder) > 1) {
        ws.send(encoding.toUint8Array(encoder));
      }

      break;

    case MessageType.Awareness: {
      const update = decoding.readVarUint8Array(decoder);
      applyAwarenessUpdate(awareness, update, ws);
      break;
    }
  }
};
