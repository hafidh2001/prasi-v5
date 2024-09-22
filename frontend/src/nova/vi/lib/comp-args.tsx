import { DeepReadonly } from "popup/script/flow/runtime/types";
import { IItem } from "utils/types/item";

export const compArgs = (
  item: DeepReadonly<IItem>,
  existing: any,
  db: any,
  api: any
) => {
  const args: any = { ...existing };
  if (item.component?.props) {
    for (const [k, prop] of Object.entries(item.component.props)) {
      let js = prop.valueBuilt || "";

      if (js.startsWith(`const _jsxFileName = "";`)) {
        js = `(() => { ${js.replace(
          `const _jsxFileName = "";`,
          `const _jsxFileName = ""; return `
        )} })()`;
      }

      const src = replaceWithObject(js, replacement) || "";

      const exports = (window as any).exports;
      const arg = {
        ...exports,
        db,
        api,
        ...existing,
      };

      const fn = new Function(
        ...Object.keys(arg),
        `// [${item.name}] ${k}: ${item.id} 
return ${src}
`
      );

      try {
        args[k] = fn(...Object.values(arg));
      } catch (e) {
        console.error(e);
        arg[k] = null;
      }
    }
  }
  return args;
};

export const replacement = {
  "stroke-width": "strokeWidth",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-linecap": "strokeLinecap",
  "clip-path": "clipPath",
  "stroke-miterlimit": "strokeMiterlimit",
};

export const replaceWithObject = (tpl: string, data: any) => {
  let res = tpl;
  for (const [k, v] of Object.entries(data)) {
    res = res.replaceAll(k, v as string);
  }
  return res;
};
