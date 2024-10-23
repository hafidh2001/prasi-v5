import { ScriptModel } from "crdt/node/load-script-models";

export const generateImports = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean
) => {
  const merged = mergeParentVars(model, models, debug);
  const imports = {} as Record<string, string[]>;

  for (const [k, v] of Object.entries(merged)) {
    if (v === model.name) continue;
    if (!imports[v]) {
      imports[v] = [];
    }
    imports[v].push(k);
  }
  const result: string[] = [];
  for (const [id, v] of Object.entries(imports)) {
    if (models[id]) {
      result.push(
        `import { ${v.join(", ")} } from "./${id}"; /* ${models[id].title.trim()} */`
      );
    }
  }

  return result.length > 0 ? `\n` + result.join("\n") : "";
};

const mergeParentVars = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean
) => {
  const variables = {} as Record<string, string>;
  const models_map = {} as Record<string, string[]>;

  for (const [k, v] of Object.entries(models)) {
    const id = k.split("~")[0];
    const prop_name = k.split("~")[1];
    if (!models_map[id]) models_map[id] = [];
    if (prop_name) {
      models_map[id].push(prop_name);
    }
  }

  for (const id of model.path_ids) {
    if (model.id !== id) {
      const m = models[id];

      if (m) {
        for (const e of Object.values(m.exports)) {
          variables[e.name] = m.id;
        }
      }
      if (models_map[id]?.length > 1) {
        for (const prop_name of models_map[id]) {
          const m = models[`${id}~${prop_name}`];

          if (m) {
            for (const e of Object.values(m.exports)) {
              variables[e.name] = `${id}~${prop_name}`;
            }
          }
        }
      }
    }
  }

  return variables;
};
