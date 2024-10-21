import { FC, ReactNode } from "react";
import { IFlowOrVar } from "utils/types/item";
import { EdVarLabel } from "../lib/var-label";
import { EdExprEditor } from "popup/expr/expr-editor";
import { EdVarPicker } from "./picker-var";
import { Bolt, ChevronDown, Trash, TriangleAlert } from "lucide-react";
import { Popover } from "utils/ui/popover";
import { iconVar } from "../lib/var-icon";
import { iconExpr } from "popup/expr/parts/expr-icon";
import { active } from "logic/active";

export const EdVarExprPicker: FC<{
  value?: IFlowOrVar;
  onChange: (value?: IFlowOrVar) => void;
  empty: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ empty, value, onChange, open, onOpenChange }) => {
  const mode = value?.mode;

  const content = (
    <div
      className={cx(
        "flex items-stretch flex-row  flex-nowrap h-[25px]",
        value &&
          (value.var || value.expr
            ? "border border-blue-500"
            : "border border-red-500"),
        css`
          svg {
            width: 15px;
            height: 15px;
          }
        `
      )}
    >
      {value && (
        <div
          className={cx(
            "cursor-pointer flex items-stretch space-x-1 pr-[1px]",
            "border overflow-hidden"
          )}
        >
          {value.mode === "var" && (
            <>
              <EdVarLabel
                value={value.var}
                className="flex hover:bg-blue-600 hover:text-white text-blue-600 items-center space-x-1 pr-[5px]"
                empty={
                  <div className="bg-red-600 text-white hover:text-red-600 hover:bg-red-200 pr-[5px] flex items-center">
                    <div className={cx("mx-1 flex justify-center ")}>
                      <TriangleAlert />
                    </div>
                    <div className="whitespace-nowrap text-sm">
                      Pick Variable
                    </div>
                  </div>
                }
              />
            </>
          )}
          {value.mode === "expr" && (
            <>
              {value.expr ? (
                <div className="hover:bg-blue-600 hover:text-white text-blue-600 flex items-center pr-[5px]">
                  <div className={cx("mx-1 flex justify-center")}>
                    {iconExpr}
                  </div>
                  <div className="whitespace-nowrap text-sm">
                    Edit Expression
                  </div>
                </div>
              ) : (
                <div className="bg-red-600 text-white hover:text-red-600 hover:bg-red-200 flex items-center pr-[5px]">
                  <div className={cx("mx-1 flex justify-center ")}>
                    <TriangleAlert />
                  </div>
                  <div className="whitespace-nowrap text-sm">
                    Blank Expression
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <Popover
        asChild
        border="1px solid black"
        content={
          <div className="flex flex-col text-sm">
            {[
              {
                name: "Use Variable",
                icon: iconVar,
                active: value?.mode === "var",
                onClick: () => {
                  onOpenChange(true);
                  onChange({ ...value, mode: "var" });
                },
              },
              {
                name: "Use Expression",
                icon: iconExpr,
                active: value?.mode === "expr",
                onClick: () => {
                  onOpenChange(true);
                  onChange({ ...value, mode: "expr" });
                },
              },
              !!value
                ? {
                    name: "Clear",
                    icon: (
                      <Trash
                        size={12}
                        className={css`
                          width: 12px !important;
                          height: 12px !important;
                        `}
                      />
                    ),
                    active: !value,
                    className: "text-red-500",
                    onClick: () => {
                      onChange(undefined);
                    },
                  }
                : null,
            ].map((e) => {
              if (!e) return null;
              return (
                <div
                  key={e.name}
                  className={cx(
                    "flex py-1 px-2 border-b items-center  cursor-pointer",
                    e.active
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600 hover:text-white",
                    e.className
                  )}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    e.onClick();
                  }}
                >
                  <div
                    className={cx(
                      "mr-1 flex justify-center",
                      css`
                        width: 20px;
                        svg {
                          width: 15px;
                          height: 15px;
                        }
                      `
                    )}
                  >
                    {e.icon}
                  </div>
                  {e.name}
                </div>
              );
            })}
          </div>
        }
      >
        <div
          className={cx(
            "border flex justify-center items-center hover:bg-blue-600 hover:text-white cursor-pointer",
            value ? "border-l-0 w-[25px]" : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {!value ? (
            <div className="px-2 flex items-center">
              {empty} <ChevronDown size={12} className="ml-2" />
            </div>
          ) : (
            <Bolt size={12} />
          )}
        </div>
      </Popover>
    </div>
  );

  if (mode === "var") {
    return (
      <EdVarPicker
        value={value?.var}
        onChange={(_var) => {
          onChange({ ...value, var: _var, mode });
          onOpenChange(false);
        }}
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
        item_id={active.item_id}
      >
        {content}
      </EdVarPicker>
    );
  }

  if (mode === "expr") {
    return (
      <EdExprEditor
        value={value?.expr}
        onChange={(expr) => onChange({ ...value, expr, mode })}
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
        item_id={active.item_id}
      >
        {content}
      </EdExprEditor>
    );
  }

  return content;
};
