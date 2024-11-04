import { getActiveNode } from "crdt/node/get-node-by-id";
import { current } from "immer";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { MessageCircleWarning, Trash, TriangleAlert } from "lucide-react";
import { FC, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";

export const EdMasterPropDetail: FC<{ children: any; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const name = p.ui.tree.comp.active;
  const prop = active.comp?.snapshot?.component?.props[name];
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
          className={cx(
            "w-[300px] text-sm",
            css`
              height: ${document.body.clientHeight - 100}px;
            `
          )}
        >
          {prop && (
            <>
              <FieldString
                label="Name"
                value={name}
                onBeforeChange={(value) => {
                  return value.replace(/[^a-zA-Z0-9_]/g, "_");
                }}
                onBlur={(value) => {
                  if (!value || value === name) return;
                  getActiveTree(p).update(
                    `Rename ${name} to ${value}`,
                    ({ tree }) => {
                      if (tree.type === "item") {
                        if (tree.component) {
                          tree.component.props[value] =
                            tree.component.props[name];
                          delete tree.component.props[name];
                          p.ui.tree.comp.active = value;
                        }
                      }
                    }
                  );
                }}
              />
              <FieldString
                label="Label"
                value={prop.label || ""}
                onChange={(value) => {
                  getActiveTree(p).update(
                    `Set Label to ${value}`,
                    ({ tree }) => {
                      if (tree.type === "item") {
                        if (tree.component) {
                          tree.component.props[name].label = value;
                        }
                      }
                    }
                  );
                }}
              />
              <div className="p-1 flex justify-start">
                <div
                  className="border border-red-100 px-1 rounded-sm flex items-center space-x-1 hover:bg-red-500 hover:text-white cursor-pointer"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to remove this property?")
                    ) {
                      getActiveTree(p).update(
                        `Remove property: ${name}`,
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
                  <TriangleAlert size={12} /> <div>Remove Property</div>
                </div>
              </div>
            </>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
};

const FieldString = (arg: {
  label: string;
  value: string;
  onBeforeChange?: (value: string) => string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}) => {
  const local = useLocal({ value: "", timeout: null as any });
  useEffect(() => {
    local.value = arg.value;
    local.render();
  }, [arg.value]);
  return (
    <label className="flex border-b">
      <div className="w-[50px] p-1">{arg.label}</div>
      <input
        type="text"
        className="p-1 flex-1 border-l outline-none focus:bg-blue-100"
        value={local.value}
        spellCheck={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
          }
        }}
        onChange={(e) => {
          local.value = e.target.value;

          if (arg.onBeforeChange) {
            local.value = arg.onBeforeChange(local.value);
          }

          local.render();
          clearTimeout(local.timeout);
          local.timeout = setTimeout(() => {
            if (arg.onChange) arg.onChange(local.value);
          }, 300);
        }}
        onBlur={() => {
          if (arg.onBlur) {
            arg.onBlur(local.value);
          }
        }}
      />
    </label>
  );
};
