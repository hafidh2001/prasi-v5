import { NodeModel } from "@minoru/react-dnd-treeview";
import { EBaseComp, EComp, PNode, SyncUndoItem } from "logic/types";
import { fg } from "popup/script/flow/utils/flow-global";
import { useEffect, useRef, useState } from "react";
import { createClient } from "utils/sync/client";
import { IItem } from "utils/types/item";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { bind } from "./lib/immer-yjs";
import { findNodeById, flattenTree } from "./node/flatten-tree";

export type CompTree = ReturnType<typeof internalLoadCompTree>;

export const loadCompTree = (opt: {
  sync: ReturnType<typeof createClient>;
  id: string;
  on_update: (comp: EBaseComp["content_tree"]) => void;
  on_component?: (item: IItem) => void;
  on_load?: (value: any) => void;
}) => {
  return new Promise<ReturnType<typeof internalLoadCompTree>>((done) => {
    internalLoadCompTree({ ...opt, on_load: done });
  });
};

export const internalLoadCompTree = (
  opt: Parameters<typeof loadCompTree>[0]
) => {
  const comp_id = opt.id;
  const sync = opt.sync;
  const doc = new Doc();
  const data = doc.getMap("data");
  const immer = bind<EComp["content_tree"]>(data);

  const state = {
    loaded: false,
  };
  const wsurl = new URL(location.href);
  wsurl.protocol = wsurl.protocol === "http:" ? "ws:" : "wss:";
  wsurl.pathname = "/crdt";
  const wsync = new WebsocketProvider(wsurl.toString(), `comp-${comp_id}`, doc);

  doc.on("update", (update, origin) => {
    component.nodes = flattenTree([immer.get()], {
      comp_id,
      visit(item) {
        if (item.component?.id && opt?.on_component) {
          opt.on_component(item);
        }
      },
    });

    fg.prasi.updated_outside = true;
    opt.on_update(immer.get());
    if (!state.loaded) {
      state.loaded = true;
      opt.on_load?.(component);
    }
  });

  const component = {
    id: comp_id,
    nodes: {
      models: [] as NodeModel<PNode>[],
      map: {} as Record<string, PNode>,
      array: [] as PNode[],
    },
    get snapshot() {
      return immer.get();
    },
    history: async () => {
      return (await _api.comp_history(comp_id)) as {
        undo: SyncUndoItem[];
        redo: SyncUndoItem[];
        history: Record<number, string>;
        ts: number;
      };
    },
    undo: (count = 1) => {
      sync.comp.undo(comp_id, count);
    },
    redo: (count = 1) => {
      sync.comp.redo(comp_id, count);
    },
    listen: (fn: () => void) => {
      return immer.subscribe(fn);
    },
    before_update: null as null | ((do_update: () => void) => void),
    update(
      action_name: string,
      fn: (opt: {
        tree: EBaseComp["content_tree"];
        flatten(): ReturnType<typeof flattenTree>;
        findNode: (id: string) => null | PNode;
        findParent: (id: string) => null | PNode;
      }) => void
    ) {
      const _fn = (tree: EBaseComp["content_tree"]) => {
        sync.comp.pending_action(comp_id, action_name);

        fn({
          tree,
          flatten: () => {
            const result = flattenTree([tree], { comp_id });
            return result;
          },
          findNode: (id) => {
            const result = findNodeById(id, [tree]);
            return result;
          },
          findParent: (id) => {
            const result = findNodeById(id, [tree]);

            if (result?.parent) {
              return findNodeById(result.parent.id, [tree]);
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
    view<T>(fn: (val: EBaseComp["content_tree"]) => T) {
      return fn(this.snapshot);
    },
    watch<T>(fn?: (val: EBaseComp["content_tree"]) => T) {
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
  return component;
};
