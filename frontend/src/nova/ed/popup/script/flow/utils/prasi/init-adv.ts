import { CompTree } from "crdt/load-comp-tree";
import { PageTree } from "crdt/load-page-tree";
import { PNode } from "logic/types";

const creating = {
  ids: new Set<string>(),
};

export const initAdv = (node?: PNode, tree?: PageTree | CompTree) => {
  if (node?.item.adv && tree) {
    if (!creating.ids.has(node.item.id)) {
      creating.ids.add(node.item.id);

      tree.update(({ findNode }) => {
        const n = findNode(node.item.id);
        if (n) {
          if (!n.item.adv) {
            n.item.adv = {};
          }
        }
      });
    }
  }
};
