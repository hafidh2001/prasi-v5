import { CompTree } from "crdt/load-comp-tree";
import { PageTree } from "crdt/load-page-tree";
import { PNode } from "logic/types";

const creating = {
  ids: new Set<string>(),
};

export const initAdv = (node?: PNode, tree?: PageTree | CompTree) => {
  if (node && tree) {
    if (!creating.ids.has(node.item.id) && !node?.item.adv) {
      creating.ids.add(node.item.id);

      tree.update("Init item script", ({ findNode }) => {
        const n = findNode(node.item.id);
        if (n) {
          if (!n.item.adv) {
            n.item.adv = {};
          }
        }
      });
      setTimeout(() => {
        creating.ids.delete(node.item.id);
      }, 300);
    }
  }
};
