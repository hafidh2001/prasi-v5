import { ScriptModel } from "crdt/node/load-script-models";
import { replaceString } from "./replace-string";

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
${inject.trim()}
// #endregion

export default () => (${model.extracted_content})`;
  return final_code;
};
