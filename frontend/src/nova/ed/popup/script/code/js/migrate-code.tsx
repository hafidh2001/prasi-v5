import { ScriptModel } from "crdt/node/load-script-models";
import { generateImports } from "./generate-imports";
import { generatePassPropAndLoop } from "./generate-passprop";

export const extractRegion = (code: string) => {
  if (code.startsWith("// #region")) {
    const lines = code.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    return lines.slice(0, region_end + 1);
  }
  return [];
};

export const removeRegion = (code: string) => {
  if (code.startsWith("// #region")) {
    const lines = code.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    return lines
      .slice(region_end + 1)
      .join("\n")
      .trim();
  }
  return code;
};

export const migrateCode = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean
) => {
  const code = model.source;
  const { local, loop } = model;

  if (code.startsWith("// #region")) {
    const lines = code.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    const main_code = lines.slice(region_end + 1).join("\n");

    let region_code = "";

    if (model.prop_name) {
      const inject = injectCompProps(model);
      region_code = generateRegion(model, models, {
        inject_end: inject.join("\n"),
      });
    } else {
      region_code = generateRegion(model, models);
    }

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

  if (loop) {
    inject = `

export const ${loop.name} = defineLoop({
  name: local_name,
  list: ${loop.list}
});
`;
  }

  if (model.prop_name) {
    model.exports[model.prop_name] = {
      name: model.prop_name,
      type: "propname",
    };
    const inject = injectCompProps(model);

    return `\
${generateRegion(model, models, {
  inject_end: inject.join("\n"),
})}

export const ${model.prop_name} = ${model.extracted_content}`;
  } else {
    return `\
${generateRegion(model, models)}${inject}

export default () => (${model.extracted_content})`;
  }
};

const injectCompProps = (model: ScriptModel) => {
  const props = model.comp_def?.content_tree.component?.props || {};
  const inject: string[] = [];

  for (const prop_name of Object.keys(props)) {
    if (!prop_name.endsWith("__") && prop_name !== model.prop_name) {
      inject.push(`const ${prop_name} = null as any;`);
    }
  }
  return inject;
};

const generateRegion = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  opt?: {
    debug?: boolean;
    inject_start?: string;
    inject_end?: string;
  }
) => {
  const imports = generateImports(model, models, opt?.debug);
  const passprop = generatePassPropAndLoop(model);
  return `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${opt?.inject_start || ""}\
${model.local.name ? `const local_name = "${model.local.name}"` : ""}\
${
  model.loop.name
    ? `\
const loop_name = "${model.loop.name}"
export const ${model.loop.name}_idx = 0 as number;\
`
    : ""
}\
${imports}${passprop}${opt?.inject_end || ""}

// #endregion`;
};
