import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { Trash2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";
import { EdVarEdit } from "./ed-var-edit";
import { EdTypeLabel } from "./lib/label";

export const EdVarItem: FC<{ name: string; node: PNode }> = ({
  name,
  node,
}) => {
  const p = useGlobal(EDGlobal, "GLOBAL");
  const vars = node.item.vars || {};
  const _var = vars[name];
  if (!_var) return null;

  const opened = p.ui.popup.vars.name === name;
  return (
    <div
      className={cx(
        "border-b flex text-sm flex-stretch select-none",
        css`
          min-height: 24px;
        `
      )}
    >
      <Wrapper
        name={name}
        opened={opened}
        close={() => {
          p.ui.popup.vars.name = "";
          p.render();
        }}
      >
        <div
          className={cx(
            "px-1 flex-1 flex items-center relative cursor-pointer",
            opened
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-600 hover:text-white"
          )}
          onClick={() => {
            p.ui.popup.vars.name = name;
            p.render();
          }}
        >
          <div className="flex-1 my-1">{name}</div>
          <EdTypeLabel type={_var.type} />
        </div>
      </Wrapper>

      {_var && (
        <Tooltip
          content="Delete Variable"
          onClick={() => {
            getActiveTree(p).update(
              `Remove Variable ${name}`,
              ({ findNode }) => {
                const n = findNode(node.item.id);
                if (n) {
                  if (!n.item.vars) {
                    n.item.vars = {};
                  }
                  delete n.item.vars[name];
                }
              }
            );
          }}
          className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-500 hover:text-white"
        >
          <Trash2 size={14} />
        </Tooltip>
      )}
    </div>
  );
};

const Wrapper: FC<{
  children: ReactNode;
  opened: boolean;
  name: string;
  close: () => void;
}> = ({ children, opened, name, close }) => {
  if (!opened) return children;
  return (
    <Popover
      backdrop={false}
      open
      asChild
      popoverClassName={css`
        border: 1px solid black;
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        .arrow {
          border: 1px solid black;
        }
      `}
      onOpenChange={() => {
        close();
      }}
      content={<EdVarEdit name={name} />}
      placement="left-start"
    >
      {children}
    </Popover>
  );
};
