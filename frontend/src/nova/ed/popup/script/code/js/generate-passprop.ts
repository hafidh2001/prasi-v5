import { ScriptModel } from "crdt/node/load-script-models";

export const generatePassProp = (model: ScriptModel) => {
  let result = "";

  const vars: any = {};
  for (const e of Object.values(model.exports)) {
    if (e.type === "passprop") {
      vars[e.name] = e.value;
    }
  }

  if (Object.values(vars).length > 0) {
    result = `
export const { 
  PassProp, 
  exports: { ${Object.keys(vars).join(", ")} }
} = definePassProp<{
  ${Object.entries(vars)
  .map((e) => `  ${e[0]}: ${e[1]}`)
  .join(";\n  ")};
  }>();`;
  }

  return result;
};
