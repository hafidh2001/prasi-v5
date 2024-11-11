import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { createClient } from "../../../utils/sync/client";
import { IItem } from "../../../utils/types/item";
import {
  EComp,
  EPage,
  EPageContentTree,
  PNode,
  SyncUndoItem,
} from "../logic/types";
import { bind } from "./lib/immer-yjs";
import { findNodeById, flattenTree } from "./node/flatten-tree";
import { loadScriptModels, ScriptModel } from "./node/load-script-models";
import { TreeVarItems } from "./node/var-items";

export type PageTree = ReturnType<typeof loadPageTree>;

type ITEM_ID = string;
type VAR_ID = string;

export const loadPageTree = (
  p: {
    comp: { loaded: Record<string, EComp>; pending: Set<string> };
    ui: any;
    render: () => void;
  },
  sync: ReturnType<typeof createClient>,
  page_id: string,
  arg?: {
    loaded: (content_tree: EPageContentTree) => void;
    on_component?: (item: IItem) => void;
  }
) => {
  const doc = new Doc();
  const data = doc.getMap("data");
  const immer = bind<EPage["content_tree"]>(data);

  const wsurl = new URL(location.href);
  wsurl.protocol = wsurl.protocol === "http:" ? "ws:" : "wss:";
  wsurl.pathname = "/crdt";
  const wsync = new WebsocketProvider(wsurl.toString(), `page-${page_id}`, doc);

  doc.on("update", async (update, origin) => {
    if (p.ui.page.saving) {
      clearTimeout(p.ui.page.saved);
      p.ui.page.saved = true;
      p.ui.page.saving = setTimeout(() => {
        p.ui.page.saving = false;
        p.ui.page.saved = true;
        p.ui.page.topbar_render();
      }, 3000);
      p.ui.page.topbar_render();
    }

    const content_tree = immer.get();
    tree.nodes = flattenTree(content_tree.childs, {
      visit(item) {
        if (item.component?.id && arg?.on_component) {
          arg.on_component(item);
        }
      },
    });
    await loadScriptModels(
      p,
      content_tree.childs,
      tree.script_models,
      tree.var_items
    );
    arg?.loaded(content_tree);
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
    script_models: {} as Record<ITEM_ID, ScriptModel>,
    var_items: {} as TreeVarItems,
    async reloadScriptModels() {
      const content_tree = immer.get();
      tree.script_models = {};
      await loadScriptModels(
        p,
        content_tree.childs,
        tree.script_models,
        tree.var_items
      );
    },
    before_update: null as null | ((do_update: () => void) => void),
    update(
      action_name: string,
      fn: (opt: {
        tree: EPage["content_tree"];
        findNode: (id: string) => null | PNode;
        flatten(): ReturnType<typeof flattenTree>;
        findParent: (id: string) => null | PNode;
      }) => void,
      done?: (opt: {
        tree: EPage["content_tree"];
        findNode: (id: string) => null | PNode;
      }) => void
    ) {
      p.ui.page.saving = true;
      p.ui.page.saved = false;
      p.ui.page.topbar_render();

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

      let unwatch = undefined as any;
      if (done) {
        unwatch = immer.subscribe(() => {
          unwatch();
          const tree = immer.get();
          done({
            tree,
            findNode: (id) => {
              const result = findNodeById(id, tree.childs);
              return result;
            },
          });
        });
      }

      if (this.before_update) {
        this.before_update(() => immer.update(_fn));
      } else {
        immer.update(_fn);
      }
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
