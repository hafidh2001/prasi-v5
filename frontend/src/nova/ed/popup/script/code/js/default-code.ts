import { active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { generateImports } from "./generate-imports";
import { getActiveNode } from "crdt/node/get-node-by-id";
import { generateRegion } from "./migrate-code";
import { jscript } from "utils/script/jscript";

export const defaultCode = {
  js: async (p: PG) => {
    const models = getActiveTree(p).script_models;
    const model = models[active.item_id];

    return await jscript.prettier.format?.(`\
${generateRegion(model, models)}

export default () => (
  <div {...props} className={cx(props.className, "")}>
    {children}
  </div>
)`);
  },
  prop: async (p: PG, name: string) => {
    const models = getActiveTree(p).script_models;
    const model = models[active.item_id];
    const item = getActiveNode(p)?.item;

    const region = `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${generateImports(model, models)}

// #endregion`;

    const comp = p.comp.loaded[item?.component?.id || ""];
    if (comp) {
      const defaultValue = comp.content_tree.component?.props[name].value;

      if (defaultValue.includes("export const")) {
        return `${region}\n\n${defaultValue}`;
      } else {
        return `${region}\n\nexport const ${name} = ${defaultValue};`;
      }
    }

    return `${region}\n\nexport const ${name} = ""`;
  },
};
