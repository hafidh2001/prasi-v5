import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem } from "utils/types/item";
import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPage, ViWrapperComp } from "./types";

export const useVi = defineStore({
  name: "vi-store",
  ref: {
    init: false,
    loader: {
      comps: (ids: string[]) => Promise<void>,
    },
    comps: {} as ViComps,
    local_value: {} as Record<string, any>,
    pass_prop_value: {} as Record<string, Record<string | number, any>>,
    db: null as any,
    api: null as any,
    item_parents: {} as Record<string, string>,
    comp_props: {} as Record<string, any>,
    wrapper: null as null | ViWrapperComp,
    cache_js: true as boolean,
  },
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
