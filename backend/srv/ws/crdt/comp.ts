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
import BunORM from "../../utils/sqlite";
import { crdt_comps } from "./shared";

await dirAsync(dir.data(`/crdt`));
const internal = {
  db: new BunORM(dir.data(`/crdt/comp.db`), {
    tables: {
      comp_updates: {
        columns: {
          comp_id: { type: "TEXT" },
          update: { type: "BLOB" },
          ts: { type: "INTEGER" },
        },
      },
    },
  }),
};

enum MessageType {
  Sync = 0,
  Awareness = 1,
}

export const wsCompClose = (ws: ServerWebSocket<WSContext>) => {
  const comp_id = ws.data.pathname.substring(`/crdt/comp-`.length);
  const comp = crdt_comps[comp_id];
  if (comp) {
    comp.ws.delete(ws);
  }
};

export const wsComp = async (ws: ServerWebSocket<WSContext>, raw: Buffer) => {
  const comp_id = ws.data.pathname.substring(`/crdt/comp-`.length);
  if (!crdt_comps[comp_id]) {
    const db_comp = await _db.component.findFirst({
      where: { id: comp_id },
      select: { content_tree: true, name: true, component_group: true },
    });
    if (!db_comp) return;

    const doc = new Doc();
    const data = doc.getMap("data");
    const immer = bind<any>(data);

    let undoManager: UndoManager | undefined;
    const updates = internal.db.tables.comp_updates.find({
      where: { comp_id },
      sort: { ts: "asc" },
    });
    if (updates.length > 0) {
      undoManager = new UndoManager(data, { captureTimeout: 0 });

      for (const d of updates) {
        applyUpdate(doc, d.update);
      }
    } else {
      immer.update(() => db_comp?.content_tree);
      const update = encodeStateAsUpdate(doc);
      internal.db.tables.comp_updates.save({ comp_id, update, ts: Date.now() });
      undoManager = new UndoManager(data);
    }
    undoManager.captureTimeout = 200;

    if (undoManager) {
      const awareness = new Awareness(doc);
      awareness.setLocalState(null);

      undoManager.on("stack-item-added", (opt) => {
        (opt.stackItem as any).ts = Date.now();
      });

      crdt_comps[comp_id] = {
        undoManager,
        doc,
        awareness,
        timeout: null,
        ws: new Set(),
      };
    }

    doc.on("update", (update, origin) => {
      const comp = crdt_comps[comp_id];
      if (comp) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MessageType.Sync);
        syncProtocol.writeUpdate(encoder, update);
        const message = encoding.toUint8Array(encoder);
        comp.ws.forEach((w) => w.send(message));

        if (origin === undoManager) {
          if (undoManager.undoing) {
            const count = internal.db.tables.comp_updates.count({
              where: { comp_id },
            });

            if (count > 1) {
              internal.db.tables.comp_updates.delete({
                where: { comp_id },
                sort: { ts: "desc" },
                limit: 1,
              });
            }
          }

          if (undoManager.redoing) {
            internal.db.tables.comp_updates.save({
              comp_id,
              update: encodeStateAsUpdate(doc),
              ts: Date.now(),
            });
          }
        } else {
          internal.db.tables.comp_updates.save({
            comp_id,
            update,
            ts: Date.now(),
          });
        }
      }
    });
  }

  const { doc, awareness, ws: comp_ws } = crdt_comps[comp_id];

  comp_ws.add(ws);
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
