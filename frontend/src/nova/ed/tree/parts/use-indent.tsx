import { TreeMethods } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { PG } from "../../logic/ed-global";
import { active, getActiveTree } from "../../logic/active";
import { scrollTreeActiveItem } from "./scroll-tree";

export const useTreeIndent = (p: PG) => {
  useEffect(() => {
    indentTree(p);
  }, [p.page.tree, active.comp?.id, active.item_id, p.ui.tree.open_all]);
};

export const indentTree = (p: PG) => {
  p.ui.tree.rename_id = "";
  if (p.ui.tree.prevent_indent) {
    p.ui.tree.prevent_indent = false;
    return;
  }

  if (p.ui.tree.open_all) {
    p.ui.tree.open_all = false;
    p.ui.tree.ref?.openAll();
    p.render();
    return;
  }

  const open = JSON.parse(localStorage.getItem("prasi-tree-open") || "{}");
  p.ui.tree.expanded = open;

  let should_open = new Set<string>(
    open[(active.comp ? `comp-${active.comp.id}` : p.page.cur?.id) || ""] || []
  );

  if (active.item_id) {
    const tree = getActiveTree(p);
    let node = tree.nodes.map[active.item_id];
    while (node) {
      if (node.parent && tree.nodes.map[node.parent.id]) {
        should_open.add(node.parent.id);
        node = tree.nodes.map[node.parent.id];
      } else {
        break;
      }
    }
  }

  if (should_open.size > 0 && p.ui.tree.ref) {
    p.ui.tree.ref.open([...should_open]);
  }

  scrollTreeActiveItem();
};
