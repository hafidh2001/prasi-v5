import { getActiveNode } from "crdt/node/get-node-by-id";
import { PG } from "logic/ed-global";

export const updateActiveCodeFromServer = (p: PG) => {
  if (!document.activeElement?.classList.contains("inputarea")) {
    if (p.ui.popup.script.mode === "js") {
      let source = getActiveNode(p)?.item.adv?.js || "";
      p.script.do_edit(async () => source.split("\n"));
    } else if (p.ui.popup.script.mode === "prop") {
      const prop_name = p.ui.comp.prop.active;
      if (prop_name) {
        let source =
          getActiveNode(p)?.item.component?.props[prop_name].value || "";

        p.script.do_edit(async () => source.trim().split("\n"));
      }
    }
  }
};
