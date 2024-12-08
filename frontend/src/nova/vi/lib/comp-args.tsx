import { DeepReadonly } from "popup/flow/runtime/types";
import { IItem } from "utils/types/item";
import { ViRender } from "vi/vi-render";
import { ViComps } from "./types";
import React from "react";

export const compArgs = (
  item: DeepReadonly<IItem>,
  comps: ViComps,
  existing: any,
  db: any,
  api: any,
  vscode_exports: any,
  standalone?: string
) => {
  const inject = {} as any;
  const args: Record<string, any> = { ...existing };
  if (item.component?.props) {
    const comp_id = item.component.id;
    const comp = comps[comp_id];

    for (const [k, master_prop] of Object.entries(
      comp.component?.props || {}
    )) {
      const prop = item.component.props[k];
      if (!prop) continue;
      let js = prop.valueBuilt || "";

      if (master_prop.meta?.type === "content-element") {
        const content = prop.content;
        if (content) {
          args[k] = {
            __jsx: true,
            __Component: ({
              parents,
              parent,
              merged,
              is_layout,
            }: {
              parents: any;
              parent: any;
              merged: any;
              is_layout: boolean;
            }) => {
              parents[content.id] = parent.id;
              return (
                <ViRender
                  is_layout={is_layout}
                  instance_id={item.id}
                  item={content}
                  standalone={standalone}
                  merged={merged}
                />
              );
            },
            __render(
              parent: IItem,
              parents: Record<string, string>,
              merged: any,
              is_layout: boolean
            ) {
              return (
                <this.__Component
                  parent={parent}
                  parents={parents}
                  merged={merged}
                  is_layout={is_layout}
                />
              );
            },
          };
        } else {
          args[k] = null;
        }
        continue;
      } else {
        if (js.startsWith(`const _jsxFileName = "";`)) {
          js = `(() => { ${js.replace(
            `const _jsxFileName = "";`,
            `const _jsxFileName = ""; return `
          )} })()`;
        }

        const src = replaceWithObject(js, replacement) || "";

        const arg = {
          ...vscode_exports,
          db,
          api,
          ...existing,
          ...inject,
        };

        let fn_src = `// [${item.name}] ${k}: ${item.id}
return ${src}
`;
        if (src.startsWith(`//prasi-prop`)) {
          fn_src = `// [${item.name}] ${k}: ${item.id}
${src.substring(`//prasi-prop`.length + 1)}`;
        }
        try {
          const fn = new Function(
            ...Object.keys(arg),
            `\
  try { 
    ${fn_src.split("\n").join(`\n    `)}
  } catch(e) {
    console.error(e);
  }`
          );

          args[k] = fn(...Object.values(arg));
        } catch (e) {
          console.error(e);
          arg[k] = null;
        }
      }
    }
  }

  return { ...inject, ...args };
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
