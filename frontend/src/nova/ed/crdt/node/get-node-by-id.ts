import { active } from "../../logic/active";
import { PG } from "../../logic/ed-global";
import { EPage, PNode } from "../../logic/types";
import { flattenTree } from "./flatten-tree";

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

export const updateNodeById = (
  p: PG,
  id: string,
  updateFn: (arg: {
    node: PNode;
    nodes: ReturnType<typeof flattenTree>;
    page_tree?: EPage["content_tree"];
  }) => void
) => {
  if (active.comp_id) {
    // if (
    //   p.comp.loaded[active.comp_id] &&
    //   p.comp.loaded[active.comp_id].nodes.map
    // ) {
    //   const meta = p.comp.loaded[active.comp_id].nodes.map[id];
    //   if (meta) {
    //     return meta;
    //   } else if (p.comp.loaded[active.comp_id].nodes.map) {
    //     for (const v of Object.values(
    //       p.comp.loaded[active.comp_id].nodes.map
    //     )) {
    //       if (v.item.id === id) return v;
    //     }
    //   }
    // }
  } else {
    p.page.tree.update((val) => {
      const node = val.findById(id);

      if (node) {
        const nodes = val.flatten();
        updateFn({ nodes, node, page_tree: val.tree });
      }
    });
  }
};
