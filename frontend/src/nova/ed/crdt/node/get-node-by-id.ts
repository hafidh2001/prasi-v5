import { active } from "../../logic/active";
import { PG } from "../../logic/ed-global";
import { EBaseComp, EPage, PNode } from "../../logic/types";
import { flattenTree } from "./flatten-tree";

export const getNodeById = (p: PG, id: string) => {
  if (active.comp?.id) {
    if (active.comp.nodes.map) {
      const meta = active.comp.nodes.map[id];
      if (meta) {
        return meta;
      } else if (active.comp.nodes.map) {
        for (const v of Object.values(active.comp.nodes.map)) {
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
    comp_tree?: EBaseComp["content_tree"];
  }) => void
) => {
  if (active.comp?.id) {
    active.comp.update((val) => {
      const node = val.findNode(id);

      if (node) {
        const nodes = val.flatten();
        updateFn({ nodes, node, comp_tree: val.tree });
      }
    });
  } else {
    p.page.tree.update((val) => {
      const node = val.findNode(id);

      if (node) {
        const nodes = val.flatten();
        updateFn({ nodes, node, page_tree: val.tree });
      }
    });
  }
};
