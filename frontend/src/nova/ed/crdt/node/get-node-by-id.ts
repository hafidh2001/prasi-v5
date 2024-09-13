import { active } from "../../logic/active";
import { PG } from "../../logic/ed-global";

export const getNodeById = (p: PG, id: string) => {
  if (active.comp_id) {
    if (
      p.comp.loaded[active.comp_id] &&
      p.comp.loaded[active.comp_id].nodes.map
    ) {
      const meta = p.comp.loaded[active.comp_id].nodes.map[id];
      if (meta) {
        return meta;
      } else if (p.comp.loaded[active.comp_id].nodes.map) {
        for (const v of Object.values(
          p.comp.loaded[active.comp_id].nodes.map
        )) {
          if (v.item.id === id) return v;
        }
      }
    }
  } else {
    return p.page.tree?.nodes.map[id];
  }
};
