import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { ChevronDown } from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Button } from "utils/ui/form/Button";
import { Popover } from "utils/ui/popover";

export const EdScriptSnippet: FC<{}> = ({}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ open: false });

  const btn_style = css`
    width: auto !important;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
  `;
  return (
    <div className="flex items-center space-x-1 pl-2">
      <Popover
        open={local.open}
        onOpenChange={(open) => {
          local.open = open;
          local.render();
        }}
        content={
          <div
            className={cx(
              "flex flex-wrap w-[300px] p-1 pb-2",
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

                p.script.do_edit(async ({ imports, body, wrapImports }) => {
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
  name: local_name,
  value: {
    
  }
})`,
                    `
export default () => (
  <div {...props} className={cx(props.className, "")}>
    <Local
      name={local_name}
      value={local}
      effect={async (${name}) => {
        //local effect
      }}
    >
      {children}
    </Local>
  </div>
)`,
                  ];
                });
                //                 p.script.do_edit(
                //                   `\
                // <div {...props} className={cx(props.className, "")}>
                // <Local
                // name="local"
                // value={
                // {
                // //local object
                // }
                // }
                // effect={async (local) => {
                // //local effect
                // }}
                // >
                // {children}
                // </Local>
                // </div>
                //     `,
                //                   true
                //                 );
              }}
            >
              &lt;Local/&gt;
            </Button>{" "}
            <Button
              className={cx(btn_style)}
              onClick={() => {
                //                 p.script.do_edit(
                //                   `\
                // <PassProp key={0} children={children} />
                //     `,
                //                   false
                //                 );
              }}
            >
              &lt;PassProp/&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                //                 p.script.do_edit(
                //                   `\
                // <div {...props} className={cx(props.className, "")}>
                // {[].map((item, idx) => (
                //   <Fragment key={idx}>
                //     <PassProp item={item} children={children} />
                //   </Fragment>
                // ))}
                // </div>
                // `,
                //                   true
                //                 );
              }}
            >
              &lt;Map /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                //                 p.script.do_edit(
                //                   `\
                // <>{true && <div {...props} className={cx(props.className, "")}>{children}</div>}</>
                // `,
                //                   true
                //                 );
              }}
            >
              &lt;If /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                //                 p.script.do_edit(
                //                   `\
                // <>
                // {
                // /**if condition */
                // true ? (
                // /** then  */
                // <div {...props} className={cx(props.className, "")}>{children}</div>
                // ) : (
                // /** else  */
                // <div {...props} className={cx(props.className, "")}>ELSE CONDITION</div>
                // )
                // }
                // </>
                // `,
                //                   true
                //                 );
              }}
            >
              &lt;If Else /&gt;
            </Button>
            <Button
              className={cx(btn_style)}
              onClick={() => {
                //                 p.script.do_edit(
                //                   `\
                // <div {...props} className={cx(props.className, "relative")}>
                //   <div className="absolute inset-0">{children}</div>
                // </div>
                // `,
                //                   true
                //                 );
              }}
            >
              &lt;Scrollable /&gt;
            </Button>
          </div>
        }
      >
        <div className="top-btn">
          Template <ChevronDown size={12} className="ml-1" />
        </div>
      </Popover>
    </div>
  );
};
