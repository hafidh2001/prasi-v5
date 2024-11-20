import { NodeModel } from "@minoru/react-dnd-treeview";
import { active } from "logic/active";
import { PG } from "logic/ed-global";
import { EBaseComp, EComp, PNode, SyncUndoItem } from "logic/types";
import { waitUntil } from "prasi-utils";
import { useEffect, useRef, useState } from "react";
import { createClient } from "utils/sync/client";
import { IItem } from "utils/types/item";
import { ViRef } from "vi/lib/store";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { bind } from "./lib/immer-yjs";
import { findNodeById, flattenTree } from "./node/flatten-tree";
import { loadScriptModels, ScriptModel } from "./node/load-script-models";
import { TreeVarItems } from "./node/var-items";

export type CompTree = ReturnType<typeof internalLoadCompTree>;

export const activateComp = async (p: PG, comp_id: string) => {
  if (active.comp) {
    active.comp.destroy();
    active.comp = null;
  }
  const id = comp_id;

  if (p.sync) {
    active.comp = await loadCompTree({
      p,
      id: id,
      async on_update(ctree) {
        if (!p.comp.loaded[id]) {
          await waitUntil(() => p.comp.loaded[id]);
        }

        if (p.viref.resetCompInstance) p.viref.resetCompInstance(id);
        p.comp.loaded[id].content_tree = ctree;
        p.render();
        p.ui.editor.render();
      },
    });
    p.ui.comp.loading_id = "";
    p.render();
  }
  p.render();
};

export const loadCompTree = (opt: {
  p: {
    comp: { loaded: Record<string, EComp>; pending: Set<string> };
    render: () => void;
    viref: ViRef;
    sync: undefined | null | ReturnType<typeof createClient>;
  };
  id: string;
  on_update?: (comp: EBaseComp["content_tree"]) => void;
  on_child_component?: (item: IItem) => void;
  activate?: boolean;
}) => {
  if (opt.activate !== false) {
    active.comp_id = opt.id;
  }
  return new Promise<ReturnType<typeof internalLoadCompTree>>((done) => {
    internalLoadCompTree(opt, done);
  });
};

export const internalLoadCompTree = (
  opt: Parameters<typeof loadCompTree>[0],
  done: (res: any) => void
) => {
  const p = opt.p;
  const comp_id = opt.id;
  const sync = opt.p.sync;
  const doc = new Doc();
  const data = doc.getMap("data");
  const immer = bind<EComp["content_tree"]>(data);

  const internal_tree = {
    loaded: false,
  };
  const wsurl = new URL(location.href);
  wsurl.protocol = wsurl.protocol === "http:" ? "ws:" : "wss:";
  wsurl.pathname = "/crdt";
  const wsync = new WebsocketProvider(wsurl.toString(), `comp-${comp_id}`, doc);

  doc.on("update", async (update, origin) => {
    const content_tree = immer.get();
    component.nodes = flattenTree([content_tree], p.comp.loaded, {
      comp_id,
      visit(item) {
        if (item.component?.id && opt?.on_child_component) {
          opt.on_child_component(item);
        }
      },
    });

    const { jsx_exports_changed } = await loadScriptModels({
      p: opt.p,
      nodes: component.nodes,
      script_models: component.script_models,
      var_items: component.var_items,
      comp_id: opt.id,
    });

    if (Object.keys(jsx_exports_changed).length > 0) {
      component.update("Update JSX Exports", ({ tree }) => {
        const props = tree.component?.props;
        if (props) {
          for (const [k, v] of Object.entries(jsx_exports_changed)) {
            if (props[k]) {
              props[k].jsxPass = v;
            }
          }
        }
      });
    }

    if (p.comp.loaded[opt.id]) {
      p.comp.loaded[opt.id].content_tree = content_tree;
    }

    if (opt.on_update) opt.on_update(content_tree);
    if (!internal_tree.loaded) {
      internal_tree.loaded = true;
      done(component);
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
      sync?.comp.undo(comp_id, count);
    },
    redo: (count = 1) => {
      sync?.comp.redo(comp_id, count);
    },
    listen: (fn: () => void) => {
      return immer.subscribe(fn);
    },
    script_models: {} as Record<string, ScriptModel>,
    var_items: {} as TreeVarItems,
    async reloadScriptModels() {
      const content_tree = immer.get();
      component.nodes = flattenTree([content_tree], p.comp.loaded, {
        comp_id,
        visit(item) {
          if (item.component?.id && opt?.on_child_component) {
            opt.on_child_component(item);
          }
        },
      });
      await loadScriptModels({
        p: opt.p,
        nodes: component.nodes,
        script_models: component.script_models,
        var_items: component.var_items,
        comp_id: opt.id,
      });
    },
    before_update: null as null | ((do_update: () => void) => void),
    update(
      action_name: string,
      fn: (opt: {
        tree: EBaseComp["content_tree"];
        flatten(): ReturnType<typeof flattenTree>;
        findNode: (id: string) => null | PNode;
        findParent: (id: string) => null | PNode;
      }) => void,
      done?: (opt: {
        tree: EBaseComp["content_tree"];
        findNode: (id: string) => null | PNode;
      }) => void
    ) {
      const _fn = (tree: EBaseComp["content_tree"]) => {
        if (done) {
          const unwatch = immer.subscribe(() => {
            unwatch();
            const tree = immer.get();
            done({
              tree,
              findNode: (id) => {
                const result = findNodeById(id, tree.childs, p.comp.loaded);
                return result;
              },
            });
          });
        }
        sync?.comp.pending_action(comp_id, action_name);

        fn({
          tree,
          flatten: () => {
            const result = flattenTree([tree], p.comp.loaded, { comp_id });
            return result;
          },
          findNode: (id) => {
            const result = findNodeById(id, [tree], p.comp.loaded);
            return result;
          },
          findParent: (id) => {
            const result = findNodeById(id, [tree], p.comp.loaded);

            if (result?.parent) {
              return findNodeById(result.parent.id, [tree], p.comp.loaded);
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

    subscribe(fn: any) {
      return immer.subscribe(fn);
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
