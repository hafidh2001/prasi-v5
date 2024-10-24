import { ScriptModel } from "crdt/node/load-script-models";
import { generateImports } from "./generate-imports";
import { generatePassProp } from "./generate-passprop";

export const migrateCode = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean
) => {
  const code = model.source;
  const { local } = model;

  if (code.startsWith("// #region")) {
    const lines = code.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    const main_code = lines.slice(region_end + 1).join("\n");

    const region_code = generateRegion(model, models, debug);

    return `\
${region_code}
${main_code}`;
  }

  let inject = "";

  if (local.name) {
    inject = `

export const ${local.name} = defineLocal({
  name: local_name,
  value: ${local.value}
});
`;
  }

  if (model.prop_name) {
    model.exports[model.prop_name] = {
      name: model.prop_name,
      type: "propname",
    };
    return `\
${generateRegion(model, models)}${inject}

export const ${model.prop_name} = ${model.extracted_content}`;
  } else {
    return `\
${generateRegion(model, models)}${inject}

export default () => (${model.extracted_content})`;
  }
};

const generateRegion = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean
) => {
  const imports = generateImports(model, models, debug);
  const passprop = generatePassProp(model);
  return `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${model.local.name ? `const local_name = "${model.local.name}"` : ""}\
${imports}${passprop}

// #endregion`;
};
