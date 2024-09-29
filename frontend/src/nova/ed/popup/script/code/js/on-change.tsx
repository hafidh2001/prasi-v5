import { getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { jscript } from "utils/script/jscript";

export const jsOnChange = (
  val: string,
  local: { change_timeout: any },
  p: PG,
  id: string
) => {
  clearTimeout(local.change_timeout);
  local.change_timeout = setTimeout(async () => {
    const transform = jscript.transform!;
    if (!p.ui.popup.script.prop_name) {
      let built = null;
      try {
        const res = await transform(`render(${val})`, {
          jsx: "transform",
          logLevel: "silent",
          format: "cjs",
          loader: "tsx",
        });
        built = res.code;
      } catch (e) {}

      getActiveTree(p).update("Update item script", ({ findNode }) => {
        const n = findNode(id);
        if (n && n.item) {
          if (!n.item.adv) {
            n.item.adv = {};
          }

          n.item.adv.js = val;
          if (built !== null) n.item.adv.jsBuilt = built;
        }
      });
    }
  }, 300);
};
