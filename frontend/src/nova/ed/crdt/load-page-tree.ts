import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { createClient } from "../../../utils/sync/client";
import { EPage, PNode, SyncUndoItem } from "../logic/types";
import { bind } from "./lib/immer-yjs";
import { findNodeById, flattenTree } from "./node/flatten-tree";
import { IItem } from "../../../utils/types/item";

export type PageTree = ReturnType<typeof loadPageTree>;

export const loadPageTree = (
  sync: ReturnType<typeof createClient>,
  page_id: string,
  arg?: { loaded: () => void; on_component?: (item: IItem) => void }
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

  doc.on("update", (update, origin) => {
    tree.nodes = flattenTree(immer.get().childs, {
      visit(item) {
        if (item.component?.id && arg?.on_component) {
          arg.on_component(item);
        }
      },
    });
    arg?.loaded();
  });

  const tree = {
    nodes: {
      models: [] as NodeModel<PNode>[],
      array: [] as PNode[],
      map: {} as Record<string, PNode>,
    },
    get snapshot() {
      return immer.get();
    },
    history: async () => {
      return (await _api.page_history(page_id)) as {
        undo: SyncUndoItem[];
        redo: SyncUndoItem[];
        history: Record<number, string>;
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
    update(
      action_name: string,
      fn: (opt: {
        tree: EPage["content_tree"];
        flatten(): ReturnType<typeof flattenTree>;
        findNode: (id: string) => null | PNode;
        findParent: (id: string) => null | PNode;
      }) => void
    ) {
      const _fn = (tree: EPage["content_tree"]) => {
        sync.page.pending_action(page_id, action_name);
        fn({
          tree,
          flatten: () => {
            const result = flattenTree(tree.childs);
            return result;
          },
          findNode: (id) => {
            const result = findNodeById(id, tree.childs);
            return result;
          },
          findParent: (id) => {
            const result = findNodeById(id, tree.childs);

            if (result?.parent) {
              return findNodeById(result.parent.id, tree.childs);
            }
            return null;
          },
        });
      };

      if (this.before_update) {
        this.before_update(() => immer.update(_fn));
      } else {
        immer.update(_fn);
      }
    },
    view<T>(fn: (val: EPage["content_tree"]) => T) {
      return fn(this.snapshot);
    },
    subscribe(fn: any) {
      return immer.subscribe(fn);
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
      wsync.destroy();
      immer.unbind();
      doc.destroy();
    },
  };

  return tree;
};
