import { ScriptModel } from "crdt/node/load-script-models";
import {
  createListItem,
  plStringifySingle,
} from "../../../../right/comp/prop-field/fields/prop-list/prop-list-util";
import { generateImports } from "./generate-imports";
import { generatePassPropAndLoop } from "./generate-passprop";
import { SingleExportVar } from "./parse-item-types";

type PROP_NAME = string;
type ITEM_ID = string;
export type JSX_PASS = Record<
  PROP_NAME,
  Record<
    ITEM_ID,
    Record<
      string,
      {
        id: string;
        type: string;
      }
    >
  >
>;

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
  comp_id?: string
) => {
  const code = model.source;
  const { local, loop } = model;

  let inject = "";

  if (local.name && local.value) {
    inject = `

export const ${local.name} = defineLocal({
  name: local_name,
  value: ${local.value}
});
`;
  }

  if (loop && loop.name) {
    inject = `

export const ${loop.name} = defineLoop({
  name: local_name,
  list: ${loop.list}
});
`;
  }

  if (model.prop_name) {
    const inject = injectCompProps(model);

    return `\
${generateRegion(model, models, {
  comp_id,
  inject_end: inject.join("\n"),
})}

export const ${model.prop_name} = ${compPropValue(model)}`;
  } else {
    return `\
${generateRegion(model, models, { comp_id })}${inject}

export default () => (${model.extracted_content})`;
  }
};

const compPropValue = (model: ScriptModel) => {
  if (model.prop_name) {
    const prop = model.comp_def?.content_tree.component?.props[model.prop_name];
    let value = model.extracted_content;

    if (prop?.meta?.type === "list") {
      const structure = new Function(`return ${prop.meta?.optionsBuilt || ""}`);
      value = `[${plStringifySingle(createListItem(structure()))}]`;
    }
    return value;
  }
  return "''";
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

export type MergeProp = Record<
  string,
  {
    id: string;
    type: string;
  }
>;

export const generateRegion = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  opt?: {
    comp_id?: string;
    debug?: boolean;
    inject_start?: string;
    inject_end?: string;
  }
) => {
  let imports = generateImports(model, models);
  if (opt?.comp_id) {
    for (const m of Object.values(models)) {
      if (
        m.comp_def?.id === opt.comp_id &&
        m.path_ids.length === 1 &&
        m.prop_name
      ) {
        imports += `\nimport { ${m.prop_name} } from "./${m.id}"; /* component props */`;
      }
    }
  }

  let jsx_pass_exports: string[] = [];
  if (model.jsx_pass?.exports) {
    let exports = [] as SingleExportVar[];
    for (const [k, v] of Object.entries(model.jsx_pass.exports)) {
      let value = "null as any";
      if (v.type === "local") {
        exports.push(v);
        continue;
      }
      jsx_pass_exports.push(`export const ${k} = ${value};`);
    }
    for (const v of exports) {
      if (v.type === "local") {
        jsx_pass_exports.push(
          `export const ${v.name} = ${`\
      defineLocal({ 
        render_mode: "${v.render_mode}", 
        name: "${v.name}", 
        value: ${v.value}
      })`};`
        );
      }
    }
    jsx_pass_exports.push("");
  }

  const passprop = generatePassPropAndLoop(model);
  return `\
// #region generated⠀
// Do not modify code inside region, any modification will be lost.

import React from "react";\
${opt?.inject_start || ""}\
${jsx_pass_exports.join("\n")}\
${model.local.name ? `const local_name = "${model.local.name}"` : ""}\
${
  model.loop.name
    ? `\
export const ${model.loop.name}_idx = 0 as number;
const loop_name = "${model.loop.name}"\
`
    : ""
}\
${imports}${passprop}${opt?.inject_end || ""}

// #endregion`;
};
