import { NodeModel } from "@minoru/react-dnd-treeview";
import { EPage, PNode } from "../logic/types";

export const compTree = (content_tree: EPage["content_tree"]) => {
  return {
    tree: null as any,
    nodes: {
      models: [] as NodeModel<PNode>[],
      map: {} as Record<string, PNode>,
      array: [] as PNode[],
    },
  };
};
