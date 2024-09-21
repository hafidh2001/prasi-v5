import { defineStore } from "../../../utils/react/define-store";
import { ViComps, ViPage } from "./types";

export const useVi = defineStore({
  name: "vi-store",
  state: {
    page: null as null | ViPage,
    comps: {} as ViComps,
  },
  action: ({ state }) => ({
    load: ({ page, comps }: { page: ViPage; comps: ViComps }) => {
      state.page = page;
      state.comps = comps;
    },
  }),
});
