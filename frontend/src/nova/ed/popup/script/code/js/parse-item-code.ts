import { ObjectExpression } from "@oxc-parser/wasm";
import { ScriptModel } from "crdt/node/load-script-models";
import get from "lodash.get";
import { cutCode, jscript } from "utils/script/jscript";
import { traverse } from "utils/script/parser/traverse";
import { parseItemLocal } from "./parse-item-local";
import { parseItemPassPropAndLoop } from "./parse-item-passprop";
import { replaceString } from "./replace-string";
import { JSXElement, JSXElementName } from "utils/script/parser/oxc-types";

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
                model.extracted_content = cutCode(model.source, d.init, -2);
                if (model.extracted_content.startsWith("=")) {
                  model.extracted_content = cutCode(model.source, d.init);
                }

                exports[d.id.name] = {
                  name: d.id.name,
                  type: "propname",
                };
              }
            } else {
              if (
                d.init?.type === "CallExpression" &&
                d.id.type === "Identifier"
              ) {
                if (d.init.callee.type === "Identifier") {
                  if (d.init.callee.name === "defineLocal") {
                    model.local.name = d.id.name;
                    model.local.value = `{}`;
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
                  } else if (d.init.callee.name === "defineLoop") {
                    model.loop.name = d.id.name;
                    model.loop.list = `[]`;
                    const value = d.init.arguments.find(
                      (e) => e.type === "ObjectExpression"
                    );
                    if (value && value.type === "ObjectExpression") {
                      const list_value = value.properties.find(
                        (e) =>
                          e.type === "ObjectProperty" &&
                          e.key.type === "Identifier" &&
                          e.key.name === "value"
                      );
                      if (list_value?.type === "ObjectProperty") {
                        model.loop.list = cutCode(
                          model.source,
                          list_value.value,
                          -2
                        );
                      }
                    }

                    exports[d.id.name] = {
                      name: d.id.name,
                      type: "loop",
                      list: model.loop.list,
                    };
                  }
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
      CallExpression: (node) => {
        if (
          node.callee.type === "StaticMemberExpression" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "map"
        ) {
          const expr = node.arguments[0];

          if (
            expr.expression === true &&
            expr.type === "ArrowFunctionExpression"
          ) {
            if (
              !Array.isArray(expr.params) &&
              expr.params.type === "FormalParameters"
            ) {
              const item_expr = expr.params.items[0];
              const idx_expr = expr.params.items[1];

              let item = "";
              if (
                item_expr.type === "FormalParameter" &&
                item_expr.pattern.type === "Identifier"
              ) {
                item = item_expr.pattern.name;
              }

              let idx = "";
              if (
                idx_expr.type === "FormalParameter" &&
                idx_expr.pattern.type === "Identifier"
              ) {
                idx = idx_expr.pattern.name;
              }

              if (item) {
                if (expr.body.type === "FunctionBody") {
                  const stmt = expr.body.statements[0];
                  if (stmt.type === "ExpressionStatement") {
                    const parent_node = node;

                    if (stmt.expression.type === "ParenthesizedExpression") {
                      const node = stmt.expression.expression as JSXElement;

                      if (node.type === "JSXElement") {
                        const name = node.openingElement.name as JSXElementName;
                        if (!model.prop_name) {
                          let val = cutCode(model.source, parent_node.callee);
                          if (val.endsWith("(")) {
                            val = cutCode(model.source, parent_node.callee, -2);
                          }
                          parseItemPassPropAndLoop({
                            name,
                            node,
                            model,
                            exports,
                            map: {
                              value: val.substring(0, val.length - 4),
                              item,
                              idx,
                            },
                          });
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

        if (!model.prop_name) {
          parseItemLocal({ name, node, model, replacements, exports });
          if (!(node as any).__processed) {
            parseItemPassPropAndLoop({ name, node, model, exports });
          }
        }
      },
    });
  }

  if (replacements.length > 0) {
    const replaced = replaceString(model.source, replacements);
    model.extracted_content = replaced;
  }
};
