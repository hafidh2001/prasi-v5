import { DeepReadonly } from "popup/script/flow/runtime/types";
import { IItem } from "utils/types/item";
import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPage } from "./types";

export const useVi = defineStore({
  name: "vi-store",
  ref: {
    init: false,
    loader: {
      comps: (ids: string[]) => Promise<void>,
    },
    comps: {} as ViComps,
    local_value: {} as Record<string, any>,
    db: null as any,
    api: null as any,
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
    }: {
      page: ViPage;
      layout?: ViPage;
      comps: ViComps;
      db: any;
      api: any;
    }) => {
      state.page = page;
      state.layout = layout || null;
      ref.comps = comps;
      ref.db = db;
      ref.api = api;

      for (const id of Object.keys(comps)) {
        state.comp.loaded.add(id);
      }
    },
  }),
});
