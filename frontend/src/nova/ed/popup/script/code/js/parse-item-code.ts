import { ObjectExpression } from "@oxc-parser/wasm";
import { ScriptModel } from "crdt/node/load-script-models";
import get from "lodash.get";
import { cutCode, jscript } from "utils/script/jscript";
import { traverse } from "utils/script/parser/traverse";
import { parseItemLocal } from "./parse-item-local";
import { parseItemPassProp } from "./parse-item-passprop";
import { replaceString } from "./replace-string";

export const parseItemCode = (model: ScriptModel) => {
  const replacements: Array<{
    start: number;
    end: number;
    replacement: string;
  }> = [];

  model.source = model.source.trim();

  const ast = jscript.parse?.(model.source, {
    sourceFilename: "script.tsx",
    sourceType: "script",
  });

  const is_exported_default = model.source.includes("export default ");

  if (!is_exported_default) {
    model.extracted_content = model.source;
  }

  if (ast) {
    const exports = model.exports;

    traverse(ast.program, {
      ExportDefaultDeclaration: (node) => {
        if (
          node.declaration.type === "ArrowFunctionExpression" &&
          node.declaration.body.type === "FunctionBody"
        ) {
          const jsx = get(
            node,
            "declaration.body.statements.0.expression.expression"
          ) as any;
          if (jsx) {
            model.extracted_content = cutCode(model.source, jsx, -2);
          }
        }
      },
      ExportNamedDeclaration: (node) => {
        if (node.declaration?.type === "VariableDeclaration") {
          for (const d of node.declaration.declarations) {
            if (model.prop_name) {
              if (d.id.type === "Identifier" && d.id.name === model.prop_name) {
                model.extracted_content = cutCode(model.source, d.init);
              }
            } else {
              if (
                d.init?.type === "CallExpression" &&
                d.id.type === "Identifier"
              ) {
                if (
                  d.init.callee.type === "Identifier" &&
                  (d.init.callee.name === "defineLocal" ||
                    d.init.callee.name === "defineAutoRender")
                ) {
                  model.local.name = d.id.name;
                  model.local.value = `{
        //local object marjiuir
      }`;
                  const value = d.init.arguments.find(
                    (e) => e.type === "ObjectExpression"
                  );
                  if (value && value.type === "ObjectExpression") {
                    const local_value = value.properties.find(
                      (e) =>
                        e.type === "ObjectProperty" &&
                        e.key.type === "Identifier" &&
                        e.key.name === "value"
                    );
                    if (local_value?.type === "ObjectProperty") {
                      model.local.value = cutCode(
                        model.source,
                        local_value.value,
                        -2
                      );
                    }
                  }

                  exports[d.id.name] = {
                    name: d.id.name,
                    type: "local",
                    value: model.local.value,
                  };
                } else {
                  const dec = d.init.arguments[0] as ObjectExpression;
                  if (dec.properties) {
                    for (const prop of dec.properties) {
                      if (
                        prop.type === "ObjectProperty" &&
                        prop.key.type === "Identifier"
                      ) {
                        const single_export = exports[d.id.name] as any;
                        if (single_export) {
                          if (prop.key.name === "name") {
                            if (
                              prop.value.type === "StringLiteral" &&
                              single_export.type !== "local"
                            )
                              single_export[prop.key.name] = prop.value.value;
                          } else {
                            single_export[prop.key.name] = cutCode(
                              model.source,
                              prop.value,
                              -2
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      JSXElement: (node) => {
        const name = node.openingElement.name;

        parseItemLocal({ name, node, model, replacements, exports });
        parseItemPassProp({ name, node, model, replacements, exports });
      },
    });
  }

  if (replacements.length > 0) {
    const replaced = replaceString(model.source, replacements);
    model.extracted_content = replaced;
  }
};
