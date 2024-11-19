import { ScriptModel } from "crdt/node/load-script-models";
import { SingleExportVar } from "./parse-item-types";
import { cutCode } from "utils/script/jscript";
import type {
  JSXAttribute,
  JSXElement,
  JSXElementName,
} from "@oxc-parser/wasm";

export const parseItemPassPropAndLoop = ({
  name,
  node,
  model,
  exports,
  map,
}: {
  name: JSXElementName;
  node: JSXElement;
  model: ScriptModel;
  exports: Record<string, SingleExportVar>;
  map?: { value?: string; item: string; idx?: string };
}) => {
  if (name.type === "JSXIdentifier") {
    if (name.name === "Loop") {
      let name = "";
      let val = "";
      for (const attr of node.openingElement.attributes) {
        if (
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.value
        ) {
          const prop_name = attr.name.name;
          if (prop_name === "name") {
            name = getValue(attr, model);
          } else if (
            prop_name === "list" &&
            attr.value.type === "JSXExpressionContainer"
          ) {
            val = cutCode(model.source, attr.value.expression);
          }
        }
      }

      if (name && val) {
        exports[name] = {
          type: "loop",
          name: name,
          list: val,
        };
      }
    }
    if (name.name === "PassProp") {
      for (const attr of node.openingElement.attributes) {
        if (
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.value
        ) {
          const prop_name = attr.name.name;
          const value = getTypings(attr, model);

          if (prop_name !== "key") {
            exports[prop_name] = {
              type: "passprop",
              name: prop_name,
              value,
              map,
            };
          }
        }
      }
    }
    (node as any).__processed = true;
  }
};

const getTypings = (attr: JSXAttribute, model: ScriptModel) => {
  let value = "any";
  let expr: any = attr.value;
  if (attr.value?.type === "JSXExpressionContainer") {
    expr = attr.value.expression;
  }
  if (expr.type === "StringLiteral") {
    value = "string";
  } else if (expr.type === "BooleanLiteral") {
    value = "boolean";
  } else if (expr.type === "NumericLiteral") {
    value = "number";
  } else if (expr.type === "TSAsExpression") {
    value = cutCode(model.source, expr.typeAnnotation);
  }
  return value;
};

const getValue = (attr: JSXAttribute, model: ScriptModel) => {
  let value = "";
  let expr: any = attr.value;
  if (attr.value?.type === "JSXExpressionContainer") {
    expr = attr.value.expression;
  }
  if (expr.type === "StringLiteral") {
    value = expr.value;
  } else if (expr.type === "BooleanLiteral") {
    value = expr.value;
  } else if (expr.type === "NumericLiteral") {
    value = expr.value;
  } else if (expr.type === "TSAsExpression") {
    value = cutCode(model.source, expr.typeAnnotation);
  }
  return value;
};
