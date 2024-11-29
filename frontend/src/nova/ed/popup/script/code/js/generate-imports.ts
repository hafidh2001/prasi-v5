import { ScriptModel } from "crdt/node/load-script-models";
import { active } from "logic/active";
import { MergeProp } from "./migrate-code";

export const generateImports = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const merged = mergeParentVars(model, models);
  const mapped = {} as Record<string, { name: string; type: string }[]>;

  for (const [k, v] of Object.entries(merged)) {
    if (v.id === model.name) continue;
    if (!mapped[v.id]) {
      mapped[v.id] = [];
    }
    mapped[v.id].push({ name: k, type: v.type });
  }
  const result: string[] = [];
  for (const [id, v] of Object.entries(mapped)) {
    if (models[id]) {
      if (v.find((e) => e.type === "passprop")) {
        result.push(
          `import { pass_prop as p_${id} } from "./${id}"; /* ${models[id].title.trim()} */`
        );
        result.push(
          `const { ${v
            .map(importMap)
            .filter((e) => e)
            .join(", ")} } = p_${id};`
        );
      } else {
        result.push(
          `import { ${v
            .map(importMap)
            .filter((e) => e)
            .join(", ")} } from "./${id}"; /* ${models[id].title.trim()} */`
        );
      }
    }
  }

  return result.length > 0 ? `\n` + result.join("\n") : "";
};

const importMap = (e: { name: string; type: string }) => {
  if (e.type === "loop") {
    return `${e.name}_idx, ${e.name}`;
  }
  return e.name;
};

export const mergeParentVars = (
  model: ScriptModel,
  script_models: Record<string, ScriptModel>,
  debug?: boolean
): MergeProp => {
  const variables = {} as Record<string, { id: string; type: string }>;

  for (const id of model.path_ids) {
    if (
      model.id !== id ||
      (model.id === id && active.comp?.snapshot.id === id)
    ) {
      const m = script_models[id];

      if (m) {
        for (const e of Object.values(m.exports)) {
          if (e.name === m.local.name && model.id === id) continue;
          variables[e.name] = { id: m.id, type: e.type };
        }

        if ((m.prop_names || []).length > 0) {
          for (const prop_name of m.prop_names || []) {
            const m = script_models[`${id}~${prop_name}`];

            if (m) {
              for (const e of Object.values(m.exports)) {
                variables[e.name] = { id: `${id}~${prop_name}`, type: e.type };
              }
            }
          }
        }
      }
    }
  }

  return variables;
};
