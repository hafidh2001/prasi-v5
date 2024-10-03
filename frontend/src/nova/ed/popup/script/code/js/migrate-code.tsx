import { ScriptModel } from "crdt/node/load-script-models";
import { generateImports } from "./merge-parent-var";

export const migrateCode = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const code = model.source;
  const { local } = model;

  if (code.startsWith("// #region")) {
    const lines = code.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    const main_code = lines.slice(region_end + 1).join("\n");

    const region_code = generateRegion(model, models);

    return `\
${region_code}
${main_code}`;
  }

  let inject = "";

  if (local.name) {
    inject = `

export const ${local.name} = defineLocal({
  name: "${local.name}",
  value: ${local.value}
});
`;
  }

  const final_code = `\
${generateRegion(model, models)}${inject}

export default () => (${model.extracted_content})`;
  return final_code;
};

const generateRegion = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const imports = generateImports(model, models);

  return `\
// #region generated⠀
import React from "react";\
${imports}
// #endregion`;
};
