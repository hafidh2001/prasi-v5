import { ScriptModel } from "crdt/node/load-script-models";
import get from "lodash.get";
import trim from "lodash.trim";
import { cutCode, jscript } from "utils/script/jscript";
import { traverse } from "utils/script/parser/traverse";
import { replaceString } from "./replace-string";
import { ObjectExpression } from "@oxc-parser/wasm";

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
    const exports = {} as Record<string, any>;
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
            if (
              d.init?.type === "CallExpression" &&
              d.id.type === "Identifier"
            ) {
              const dec = d.init.arguments[0] as ObjectExpression;
              if (dec.properties) {
                for (const prop of dec.properties) {
                  if (
                    prop.type === "ObjectProperty" &&
                    prop.key.type === "Identifier"
                  ) {
                    if (!exports[d.id.name]) {
                      exports[d.id.name] = {};
                    }

                    exports[d.id.name][prop.key.name] = cutCode(
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
      },
      JSXElement: (node) => {
        const name = node.openingElement.name;

        if (name.type === "JSXIdentifier") {
          if (name.name === "Local") {
            for (const attr of node.openingElement.attributes) {
              if (
                attr.type === "JSXAttribute" &&
                attr.name.type === "JSXIdentifier" &&
                attr.value
              ) {
                if (attr.name.name === "name") {
                  if (attr.value.type === "StringLiteral") {
                    model.local.name = attr.value.value;
                    replacements.push({
                      ...attr.value,
                      replacement: `{${model.local.name}[_local_name_]}`,
                    });
                  } else if (attr.value.type === "JSXExpressionContainer") {
                    if (
                      attr.value.expression.type === "ComputedMemberExpression"
                    ) {
                      const name = get(
                        exports,
                        cutCode(
                          model.source,
                          attr.value.expression.object,
                          -2
                        ) + ".name"
                      );

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
                    model.local.value = cutCode(
                      model.source,
                      attr.value.expression
                    );
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
      },
    });
  }

  if (replacements.length > 0) {
    const replaced = replaceString(model.source, replacements);
    model.extracted_content = replaced;
  }
};
