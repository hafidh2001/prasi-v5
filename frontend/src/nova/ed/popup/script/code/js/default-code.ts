import { active, getActiveTree } from "logic/active";
import { PG } from "logic/ed-global";
import { generateImports } from "./generate-imports";

export const defaultCode = {
  js: (p: PG) => {
    const models = getActiveTree(p).script_models;
    const model = models[active.item_id];

    return `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${generateImports(model, models)}

// #endregion

export default () => (
  <div {...props} className={cx(props.className, "")}>
    {children}
  </div>
)`;
  },
  prop: (p: PG, name: string) => {
    const models = getActiveTree(p).script_models;
    const model = models[active.item_id];

    return `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${generateImports(model, models)}

// #endregion

export const ${name} = ""`;
  },
};
