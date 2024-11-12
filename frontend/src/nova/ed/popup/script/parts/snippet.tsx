import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import {
  ChevronDown,
  NotepadTextDashed,
  ScrollText,
  Stamp,
} from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Button } from "utils/ui/form/Button";
import { Popover } from "utils/ui/popover";

export const EdCodeSnippet: FC<{}> = ({}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ open: false });

  const btn_style = css`
    width: auto !important;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
  `;
  return (
    <div className="flex items-center space-x-1 pl-1">
      <Popover
        open={local.open}
        onOpenChange={(open) => {
          local.open = open;
          local.render();
        }}
        content={
          <div
            className={cx(
              "flex flex-wrap mr-2 p-1 pb-2",
              css`
                > * {
                  margin-left: 5px;
                  margin-top: 5px;
                }
              `
            )}
          >
            <Button
              className={cx(btn_style)}
              onClick={() => {
                local.open = false;
                local.render();
                p.script.snippet_pasted = true;
                p.script.do_edit(async ({ imports, wrapImports }) => {
                  let name = "local";
                  let idx = 2;
                  const item_name =
                    getActiveNode(p)
                      ?.item.name.toLowerCase()
                      .replace(/\W/gi, "_") || "local_new";
                  while (
                    imports.find((e) => e.startsWith(`import { ${name} }`))
                  ) {
                    if (name === "local") {
                      name = item_name;
                    } else if (name === item_name) {
                      name = `local_${idx++}`;
                    }
                  }
                  return [
                    wrapImports([
                      ...imports.filter(
                        (e) => !e.startsWith("const local_name")
                      ),
                      `const local_name = "${name}"`,
                    ]),
                    `\
export const ${name} = defineLocal({
  render_mode: "auto",
  name: local_name,
  value: {
    
  }
})`,
                    `
export default () => (
  <div {...props} className={cx(props.className, "")}>
    <Local
      name={local_name}
      value={${name}}
      effect={async (${name}) => {
        
      }}
    >
      {children}
    </Local>
  </div>
)`,
                  ];
                });
              }}
            >
              &lt;Local/&gt;
            </Button>{" "}
            <Button
              className={cx(btn_style)}
              onClick={() => {
                local.open = false;
                local.render();
                p.script.snippet_pasted = true;
                p.script.do_edit(async ({ imports, wrapImports }) => {
                  let p_idx = 0;
                  return [
                    wrapImports([
                      ...imports.filter((e, idx) => {
                        if (e.startsWith("const loop_name")) {
                          p_idx = idx;
                          return false;
                        }
                        if (p_idx > 0 && idx >= p_idx) return false;
                        return true;
                      }),
                      `\
const loop_name = "item";
export const item_idx = 0 as number;
`,
                    ]),
                    `\
export const item = defineLoop({
  list: [1, 2, 3],
  loop_name
})

export default () => (
  <div {...props} className={cx(props.className, "")}>
    <Loop bind={item} />
  </div>
)
`,
                  ];
                });
              }}
            >
              &lt;Loop /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                local.open = false;
                local.render();
                p.script.snippet_pasted = true;
                p.script.do_edit(async ({ imports, wrapImports }) => {
                  let p_idx = 0;
                  return [
                    wrapImports([
                      ...imports.filter((e, idx) => {
                        if (e.startsWith("export const pass_prop_list")) {
                          p_idx = idx;
                          return false;
                        }
                        if (p_idx > 0 && idx >= p_idx) return false;
                        return true;
                      }),
                      `\

const PassProp: React.FC<
  {  children: any } & Record<string, any>
> = null as any`,
                    ]),
                    `\
export default () => (
  <div {...props} className={cx(props.className, "")}>
    <PassProp sample={"hello"}>
      { children }
    </PassProp>
  </div>
)
`,
                  ];
                });
              }}
            >
              &lt;PassProp /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                local.open = false;
                local.render();
                p.script.snippet_pasted = true;
                p.script.do_edit(async ({ imports, wrapImports }) => {
                  return [
                    wrapImports(imports),
                    `\
export default () => (
  <IF
    condition={true}
    then={
      <div {...props} className={cx(props.className, "")}>
        {children}
      </div>
    }
    else={<></>}
  />
)
`,
                  ];
                });
              }}
            >
              &lt;If Else /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                local.open = false;
                local.render();
                p.script.snippet_pasted = true;
                p.script.do_edit(async ({ imports, wrapImports }) => {
                  return [
                    wrapImports(imports),
                    `\
export default () => (
  <div {...props} className={cx(props.className, "relative overflow-auto")}>
    <div className="absolute inset-0">{children}</div>
  </div>
)
`,
                  ];
                });
              }}
            >
              &lt;Scrollable /&gt;
            </Button>
          </div>
        }
      >
        <div className="top-btn">
          <ScrollText size={12} className="mr-1" />
          Template
        </div>
      </Popover>
    </div>
  );
};
