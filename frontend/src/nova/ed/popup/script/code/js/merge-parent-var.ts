import { ScriptModel } from "crdt/node/load-script-models";

export const generateImports = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const merged = mergeParentVars(model, models);
  const imports = {} as Record<string, string[]>;

  for (const [k, v] of Object.entries(merged)) {
    if (v === model.name) continue;
    if (!imports[v]) {
      imports[v] = [];
    }
    imports[v].push(k);
  }
  const result: string[] = [];
  for (const [k, v] of Object.entries(imports)) {
    const id = k.replace(".tsx", "").replace("file:///", "");
    result.push(
      `import { ${v.join(", ")} } from "./${id}"; /* ${models[id].title.trim()} */`
    );
  }

  return result.length > 0 ? `\n` + result.join("\n") : "";
};

const mergeParentVars = (
  model: ScriptModel,
  models: Record<string, ScriptModel>
) => {
  const variables = {} as Record<string, string>;

  for (const id of model.path_ids) {
    if (model.id !== id) {
      const m = models[id];
      if (m) {
        if (m.local.name) {
          variables[m.local.name] = m.name;
        }
      }
    }
  }
  return variables;
};
