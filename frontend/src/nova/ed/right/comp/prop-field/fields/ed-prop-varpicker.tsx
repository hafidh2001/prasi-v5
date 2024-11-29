import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { monacoRegisterSource } from "popup/script/code/js/create-model";
import { generateImports } from "popup/script/code/js/generate-imports";
import { generateRegion } from "popup/script/code/js/migrate-code";
import { registerPrettier } from "popup/script/code/js/register-prettier";
import { registerReact } from "popup/script/code/js/register-react";
import { MonacoRaw } from "popup/script/code/monaco-raw";
import { remountPrasiModels } from "popup/script/code/prasi-code-update";
import { Resizable } from "re-resizable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Popover } from "utils/ui/popover";

export const EdPropVarPicker = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      open: false,
      timeout: null as any,
      value: instance.props[name].value,
      size: localStorage.getItem("prasi-size-varpicker") || "700x200",
    },
    async () => {
      const tree = getActiveTree(p);
      const region = generateRegion(
        tree.script_models[active.item_id],
        tree.script_models
      );

      if (local.value === '""') {
        local.value = `${region}\n\nexport const ${name} = null;`;
      }
    }
  );

  const w = local.size?.split("x")[0];
  const h = local.size?.split("x")[1];

  return (
    <div
      className={cx(
        "border-l flex-1 flex justify-between p-1 items-center",
        css`
          background: white;
          color: black;
        `
      )}
    >
      <Popover
        placement="right"
        backdrop={false}
        content={
          <Resizable
            className="flex-1 flex"
            defaultSize={{ width: w, height: h }}
            onResizeStop={(_, __, div) => {
              localStorage.setItem(
                "prasi-size-varpicker" ,
                div.clientHeight.toString() + "x" + div.clientWidth.toString()
              );
            }}
          >
            <MonacoRaw
              id="field-code"
              lang="typescript"
              value={local.value || ""}
              onChange={(value) => {
                local.value = value || "";
                clearTimeout(local.timeout);
              }}
              onMount={async ({ editor, monaco }) => {
                const props = Object.keys(
                  active.comp?.snapshot.component?.props || {}
                )
                  .filter((e) => !e.endsWith("__"))
                  .map((prop) => `const ${prop} = null as any;`);

                monacoRegisterSource(
                  monaco,
                  props.join("\n"),
                  "file:///prop-typings.d.ts"
                );

                monacoRegisterSource(
                  monaco,
                  `import * as ImportReact from "react"; declare global { const React = ImportReact }`,
                  "file:///react-typings.ts"
                );

                remountPrasiModels({
                  activeFileName: "file:///active-prop.tsx",
                  editor,
                  monaco,
                  p,
                  models: [
                    {
                      name: "file:///active-prop.tsx",
                      source: local.value,
                      model: editor.getModel() as any,
                    },
                  ],
                  async onMount(m) {
                    await registerReact(monaco);
                    registerPrettier(monaco);

                    const line = m?.model?.getLineCount() || 0;
                    if (line) {
                      const expr = `export const ${name} = `;
                      editor.setSelection(
                        new monaco.Selection(
                          line,
                          expr.length + 1,
                          line,
                          expr.length + 5
                        )
                      );
                      editor.focus();
                    }
                  },
                });
              }}
            />
          </Resizable>
        }
        className={cx(
          "flex items-center flex-1 cursor-pointer",
          local.open && "bg-blue-500"
        )}
      >
        <div
          className={cx(
            "border px-2 ",
            local.open
              ? "border-transparent text-white"
              : "bg-white hover:bg-blue-500 hover:text-white"
          )}
        >
          Pick Variable
        </div>
      </Popover>
    </div>
  );
};
