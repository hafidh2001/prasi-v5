import { ScriptModel } from "crdt/node/load-script-models";
import { generateImports } from "./merge-parent-var";

export const migrateCode = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const code = model.source;
  const { local } = model;
  if (code.startsWith("// #region")) {
    return code;
  }

  let inject = "";

  const imports = generateImports(model, models);

  if (local.name) {
    inject = `

export const ${local.name} = {
  name: "${local.name}",
  value: ${local.value},
}
`;
  }

  const final_code = `\
// #region system⠀  
import React from "react";\
${imports}
// #endregion${inject}

export default () => (${model.extracted_content})`;
  return final_code;
};
