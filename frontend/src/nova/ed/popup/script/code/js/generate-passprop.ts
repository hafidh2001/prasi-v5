import { ScriptModel } from "crdt/node/load-script-models";

export const generatePassProp = (model: ScriptModel) => {
  let result = "";

  const vars: any = {};
  for (const e of Object.values(model.exports)) {
    if (e.type === "passprop") {
      if (e.name !== "key") {
        vars[e.name] = e.value;
      }
    }
  }

  if (Object.values(vars).length > 0) {
    result = `
export const pass_prop = {
${Object.entries(vars)
  .map((e) => `${e[0]}: null as unknown as ${e[1]}`)
  .join(",\n")}
}
const PassProp: React.FC<{ key: any; children: any } & typeof pass_prop & Record<string, any>> = null as any
;`;
  }

  return result;
};
