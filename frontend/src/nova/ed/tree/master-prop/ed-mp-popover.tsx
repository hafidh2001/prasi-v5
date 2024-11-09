import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { Popover } from "utils/ui/popover";
import { EdMasterPropBodyBasic } from "./ed-mp-body-basic";
import { Trash } from "lucide-react";
export const EdMasterPropDetail: FC<{ children: any; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const name = p.ui.tree.comp.active;
  const props = active.comp?.snapshot?.component?.props || {};
  const prop = active.comp?.snapshot?.component?.props[name];
  const is_group = name.endsWith("__");

  return (
    <Popover
      open={true}
      backdrop={false}
      offset={10}
      asChild
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
      content={
        <div
          tabIndex={1}
          onKeyDown={(e) => {
            e.stopPropagation();
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
              e.preventDefault();
            }
          }}
          className={cx(
            "w-[300px] text-sm outline-none",
            css`
              height: ${document.body.clientHeight - 100}px;
            `
          )}
        >
          {prop && (
            <>
              {is_group ? (
                <EdMasterPropBodyBasic name={name} prop={prop} props={props} />
              ) : (
                <>
                  <div className="bg-purple-600 p-2 pb-0 flex items-end justify-between">
                    <div className="flex items-end justify-between">
                      {["basic", "advanced"].map((e) => {
                        return (
                          <div
                            key={e}
                            onClick={() => {
                              p.ui.tree.comp.tab = e as any;
                              p.render();
                            }}
                            className={cx(
                              "px-2 pt-1 pb-[2px] capitalize rounded-t-[3px] cursor-pointer",
                              p.ui.tree.comp.tab === e
                                ? "bg-white text-purple-600"
                                : "text-white bg-purple-500"
                            )}
                          >
                            {e}
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className=" px-1 rounded-sm flex items-center cursor-pointer mb-1 text-white hover:bg-red-500"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to remove this property?"
                          )
                        ) {
                          getActiveTree(p).update(
                            `Remove Property ${name}`,
                            ({ tree }) => {
                              if (tree.type === "item") {
                                if (tree.component) {
                                  delete tree.component.props[name];
                                }
                              }
                            }
                          );
                        }
                      }}
                    >
                      <Trash size={12} className="mr-1" /> <div>Remove</div>
                    </div>
                  </div>
                  {p.ui.tree.comp.tab === "basic" && (
                    <EdMasterPropBodyBasic
                      name={name}
                      prop={prop}
                      props={props}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
};
