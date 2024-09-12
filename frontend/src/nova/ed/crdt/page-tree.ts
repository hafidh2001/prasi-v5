import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { createClient } from "../../../utils/sync/client";
import { EPage } from "../logic/types";
import { bind } from "./lib/immer-yjs";

export type PageTree = ReturnType<typeof pageTree>;

export const pageTree = (
  sync: ReturnType<typeof createClient>,
  page_id: string,
  arg?: { loaded: () => void }
) => {
  const doc = new Doc();
  const data = doc.getMap("data");
  const immer = bind<EPage["content_tree"]>(data);

  const state = {
    loaded: false,
  };
  const wsurl = new URL(location.href);
  wsurl.protocol = wsurl.protocol === "http:" ? "ws:" : "wss:";
  wsurl.pathname = "/crdt";
  const wsync = new WebsocketProvider(wsurl.toString(), `page-${page_id}`, doc);

  wsync.on("sync", (synced: boolean) => {
    if (synced && !state.loaded) {
      state.loaded = true;
      arg?.loaded();
    }
  });

  return {
    get snapshot() {
      return immer.get();
    },
    history: async () => {
      return _api.page_history(page_id);
    },
    undo: () => {
      sync.page.undo(page_id);
    },
    redo: () => {
      sync.page.redo(page_id);
    },
    update: immer.update,
    view<T>(fn: (val: EPage["content_tree"]) => T) {
      return fn(this.snapshot);
    },
    watch<T>(fn?: (val: EPage["content_tree"]) => T) {
      if (fn) {
        const ref = useRef<T>(fn(this.snapshot));
        const [_, render] = useState({});
        useEffect(() => {
          const unwatch = immer.subscribe((val) => {
            if (Object.keys(val).length > 0) {
              const new_val = fn(val);
              if (new_val !== ref.current) {
                ref.current = new_val;
                render({});
              }
            }
          });
          return () => {
            unwatch();
          };
        }, []);
        return ref.current;
      } else {
        const [_, render] = useState({});
        useEffect(() => {
          const unwatch = immer.subscribe((val) => {
            render({});
          });
          return () => {
            unwatch();
          };
        }, []);
      }
    },
    destroy: async () => {
      immer.unbind();
      // await idb.destroy();
      doc.destroy();
    },
  };
};
