import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPage } from "./types";

export const useVi = defineStore({
  name: "vi-store",
  ref: {
    init: false,
    loader: {
      comps: (ids: string[]) => Promise<void>,
    },
  },
  state: {
    page: null as null | ViPage,
    layout: null as null | ViPage,
    comps: {} as ViComps,
  },
  action: ({ state }) => ({
    init: ({
      page,
      comps,
      layout,
    }: {
      page: ViPage;
      layout?: ViPage;
      comps: ViComps;
    }) => {
      state.page = page;
      state.layout = layout || null;
      state.comps = comps;
    },
  }),
});
