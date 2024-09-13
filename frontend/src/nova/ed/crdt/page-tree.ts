import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { createClient } from "../../../utils/sync/client";
import { EPage } from "../logic/types";
import { bind, UpdateFn } from "./lib/immer-yjs";

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
    if (synced) {
      if (!state.loaded) {
        state.loaded = true;
        arg?.loaded();
      }
    }
  });

  return {
    get snapshot() {
      return immer.get();
    },
    history: async () => {
      return (await _api.page_history(page_id)) as {
        undo: {ts: number, size: string}[];
        redo: {ts: number, size: string}[];
        ts: number;
      };
    },
    undo: (count = 1) => {
      sync.page.undo(page_id, count);
    },
    redo: (count = 1) => {
      sync.page.redo(page_id, count);
    },
    listen: (fn: () => void) => {
      return immer.subscribe(fn);
    },
    before_update: null as null | ((do_update: () => void) => void),
    update(fn: UpdateFn<EPage["content_tree"]>) {
      if (this.before_update) {
        this.before_update(() => immer.update(fn));
      } else {
        immer.update(fn);
      }
    },
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
