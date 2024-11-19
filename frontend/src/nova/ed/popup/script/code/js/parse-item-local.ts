import { ScriptModel } from "crdt/node/load-script-models";
import get from "lodash.get";
import trim from "lodash.trim";
import { cutCode } from "utils/script/jscript";
import { SingleExportVar } from "./parse-item-types";
import type { JSXElement, JSXElementName } from "@oxc-parser/wasm";

export const parseItemLocal = ({
  name,
  node,
  model,
  replacements,
  exports,
}: {
  name: JSXElementName;
  node: JSXElement;
  model: ScriptModel;
  replacements: Array<{
    start: number;
    end: number;
    replacement: string;
  }>;
  exports: Record<string, SingleExportVar>;
}) => {
  if (name.type === "JSXIdentifier") {
    if (name.name === "Local") {
      for (const attr of node.openingElement.attributes) {
        if (
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.value
        ) {
          if (attr.name.name === "auto_render") {
            model.local.auto_render = true;
          }
          if (attr.name.name === "name") {
            if (attr.value.type === "StringLiteral") {
              model.local.name = attr.value.value;
              replacements.push({
                ...attr.value,
                replacement: `{ local_name }`,
              });
            } else if (attr.value.type === "JSXExpressionContainer") {
              if (attr.value.expression.type === "ComputedMemberExpression") {
                const name = get(
                  exports,
                  cutCode(model.source, attr.value.expression.object) + ".name"
                ) as unknown as string;

                if (name) {
                  model.local.name = trim(name, "`'\"");
                }
              }
            }
          } else if (attr.name.name === "value") {
            if (
              attr.value.type === "JSXExpressionContainer" &&
              attr.value.expression.type === "ObjectExpression"
            ) {
              model.local.value = cutCode(model.source, attr.value.expression);
              replacements.push({
                ...attr.value.expression,
                replacement: `${model.local.name}`,
              });
            }
          }
        }
      }
    }
  }
};
