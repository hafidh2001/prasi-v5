import { ScriptModel } from "crdt/node/load-script-models";

export const generateImports = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean,
) => {
  const merged = mergeParentVars(model, models, debug);
  const imports = {} as Record<string, { name: string; type: string }[]>;

  for (const [k, v] of Object.entries(merged)) {
    if (v.id === model.name) continue;
    if (!imports[v.id]) {
      imports[v.id] = [];
    }
    imports[v.id].push({ name: k, type: v.type });
  }
  const result: string[] = [];
  for (const [id, v] of Object.entries(imports)) {
    if (models[id]) {
      if (v.find((e) => e.type === "passprop")) {
        result.push(
          `import { pass_prop as p_${id} } from "./${id}"; /* ${models[id].title.trim()} */`,
        );
        result.push(
          `const { ${v
            .map((e) => e.name)
            .filter((e) => e)
            .join(", ")} } = p_${id};`,
        );
      } else {
        result.push(
          `import { ${v
            .map((e) => e.name)
            .filter((e) => e)
            .join(", ")} } from "./${id}"; /* ${models[id].title.trim()} */`,
        );
      }
    }
  }

  return result.length > 0 ? `\n` + result.join("\n") : "";
};

const mergeParentVars = (
  model: ScriptModel,
  models: Record<string, ScriptModel>,
  debug?: boolean,
) => {
  const variables = {} as Record<string, { id: string; type: string }>;
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
          variables[e.name] = { id: m.id, type: e.type };
        }
      }

      if (models_map[id]?.length > 1) {
        for (const prop_name of models_map[id]) {
          const m = models[`${id}~${prop_name}`];

          if (m) {
            for (const e of Object.values(m.exports)) {
              variables[e.name] = { id: `${id}~${prop_name}`, type: e.type };
            }
          }
        }
      }
    }
  }

  return variables;
};
