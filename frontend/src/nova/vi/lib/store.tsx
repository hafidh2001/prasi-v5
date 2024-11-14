import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem, IVar } from "utils/types/item";
import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPageRoot, ViWrapperType } from "./types";

type ITEM_ID = string;
type VAR_NAME = string;
type VAR_ID = string;

const viRef = {
  init: false,
  mode: "desktop" as "mobile" | "desktop",

  loader: {
    comps: (ids: string[]) => Promise<void>,
  },
  comps: {} as ViComps,
  db: null as any,
  api: null as any,
  item_parents: {} as Record<ITEM_ID, ITEM_ID>,
  comp_props: {} as Record<ITEM_ID, Record<VAR_NAME, any>>,
  var_items: {} as Record<VAR_ID, { var: IVar<any>; item: IItem }>,

  wrapper: null as null | ViWrapperType,
  instanced: {} as Record<ITEM_ID, any>,

  page: null as null | ViPageRoot,
  layout: null as null | ViPageRoot,
  comp: { instances: {} as Record<string, IItem>, loaded: new Set<string>() },

  edit_comp_id: "",
  local_render: {} as Record<string, () => void>,

  dev_item_error: {} as Record<string, any>,
  dev_tree_render: {} as Record<string, () => void>,

  resetCompInstance: (comp_id: string) => {},
  resetLocal: () => {},

  vscode_exports: {} as Record<string, any>,
};
export type ViRef = typeof viRef;

export const useVi = defineStore({
  name: "vi-store",
  ref: viRef,
  state: {},
  action: ({ state, ref, update }) => ({
    instantiateComp: (item: DeepReadonly<IItem>) => {
      const comp_id = item.component!.id;
      if (!ref.comp.instances[item.id] && comp_id && ref.comps[comp_id]) {
        ref.comp.instances[item.id] = structuredClone(ref.comps[comp_id]);
        ref.comp.instances[item.id].id = item.id;
      }
    },
    resetCompInstance: (comp_id: string) => {
      for (const [k, v] of Object.entries(ref.comp.instances)) {
        if (v.component?.id === comp_id) {
          delete ref.comp.instances[k];
        }
      }
    },
    syncProp: ({
      page,
      comps,
      layout,
      db,
      api,
      mode,
      edit_comp_id,
    }: {
      page: ViPageRoot;
      layout?: ViPageRoot;
      comps: ViComps;
      db: any;
      api: any;
      mode: "desktop" | "mobile";
      edit_comp_id?: string;
    }) => {
      ref.page = page;
      ref.layout = layout || null;
      ref.comps = comps;
      ref.db = db;
      ref.api = api;
      ref.mode = mode;
      ref.edit_comp_id = edit_comp_id || "";
      ref.resetLocal = () => {
        ref.dev_tree_render = {};
        ref.dev_item_error = {};
      };
      for (const id of Object.keys(comps)) {
        ref.comp.loaded.add(id);
      }
    },
  }),
});
