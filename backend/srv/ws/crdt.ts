import type { ServerWebSocket } from "bun";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { applyAwarenessUpdate, Awareness } from "y-protocols/awareness.js";
import { readSyncMessage } from "y-protocols/sync.js";
import { Doc, UndoManager } from "yjs";
import type { WSContext } from "../utils/server/ctx";
import * as syncProtocol from "y-protocols/sync.js";
import { bind } from "prasi-frontend/src/nova/ed/crdt/lib/immer-yjs";

export const crdt_pages = {} as Record<
  string,
  {
    doc: Doc;
    awareness: Awareness;
    undoManager: UndoManager;
    timeout: any;
    ws: Set<ServerWebSocket<WSContext>>;
    is_dirty: boolean;
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
    const doc = new Doc();

    const data = doc.getMap("data");
    const immer = bind<any>(data);
    const db_page = await _db.page.findFirst({
      where: { id: page_id },
      select: { content_tree: true },
    });
    immer.update(() => db_page?.content_tree);

    const awareness = new Awareness(doc);
    awareness.setLocalState(null);
    const undoManager = new UndoManager(data);

    undoManager.on("stack-item-added", (opt) => {
      (opt.stackItem as any).ts = Date.now();
    });

    crdt_pages[page_id] = {
      undoManager,
      doc,
      awareness,
      timeout: null,
      ws: new Set(),
      is_dirty: false,
    };

    doc.on("update", (update, origin) => {
      const page = crdt_pages[page_id];
      if (page) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MessageType.Sync);
        syncProtocol.writeUpdate(encoder, update);
        const message = encoding.toUint8Array(encoder);
        page.ws.forEach((w) => w.send(message));
        page.is_dirty = true;
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

    default:
      throw new Error("unsupported message type");
  }
};
