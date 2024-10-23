import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem, IVar } from "utils/types/item";
import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPage, ViWrapperType } from "./types";

type ITEM_ID = string;
type VAR_NAME = string;
type VAR_ID = string;

const viRef = {
  init: false,
  loader: {
    comps: (ids: string[]) => Promise<void>,
  },
  comps: {} as ViComps,
  db: null as any,
  api: null as any,
  item_parents: {} as Record<ITEM_ID, ITEM_ID>,
  comp_props: {} as Record<ITEM_ID, Record<VAR_NAME, any>>,
  var_items: {} as Record<VAR_ID, { var: IVar<any>; item: IItem }>,

  local_value: {} as Record<ITEM_ID, Record<VAR_NAME, any>>,
  pass_prop_value: {} as Record<ITEM_ID, Record<string | number, any>>,

  wrapper: null as null | ViWrapperType,
  cache_js: true as boolean,

  resetCompInstance: (comp_id: string) => {},
};
export type ViRef = typeof viRef;

export const useVi = defineStore({
  name: "vi-store",
  ref: viRef,
  state: {
    mode: "desktop" as "mobile" | "desktop",
    page: null as null | ViPage,
    layout: null as null | ViPage,
    local_render: {} as Record<string, number>,
    comp: { instances: {} as Record<string, IItem>, loaded: new Set<string>() },
  },
  action: ({ state, ref, update }) => ({
    instantiate_comp: (item: DeepReadonly<IItem>) => {
      const comp_id = item.component!.id;
      if (!state.comp.instances[item.id] && comp_id && ref.comps[comp_id]) {
        state.comp.instances[item.id] = structuredClone(ref.comps[comp_id]);
        state.comp.instances[item.id].id = item.id;
      }
    },
    reset_comp_instance: (comp_id: string) => {
      for (const [k, v] of Object.entries(state.comp.instances)) {
        if (v.component?.id === comp_id) {
          delete state.comp.instances[k];
        }
      }
    },
    init: ({
      page,
      comps,
      layout,
      db,
      api,
      mode,
    }: {
      page: ViPage;
      layout?: ViPage;
      comps: ViComps;
      db: any;
      api: any;
      mode: "desktop" | "mobile";
    }) => {
      state.page = page;
      state.layout = layout || null;
      ref.comps = comps;
      ref.db = db;
      ref.api = api;
      state.mode = mode;

      for (const id of Object.keys(comps)) {
        state.comp.loaded.add(id);
      }
    },
  }),
});
