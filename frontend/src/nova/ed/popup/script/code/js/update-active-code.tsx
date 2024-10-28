import { getActiveNode } from "crdt/node/get-node-by-id";
import { PG } from "logic/ed-global";

export const updateActiveCode = (p: PG) => {
  if (p.ui.popup.script.mode === "js") {
    const source = getActiveNode(p)?.item.adv?.js || "";
    p.script.ignore_changes = true;
    p.script.do_edit(async () => source.split("\n"));
  } else if (p.ui.popup.script.mode === "prop") {
    const prop_name = p.ui.comp.prop.active;
    if (prop_name) {
      const source =
        getActiveNode(p)?.item.component?.props[prop_name].value || "";
      p.script.ignore_changes = true;
      p.script.do_edit(async ({}) => source.trim().split("\n"));
    }
  }
};
