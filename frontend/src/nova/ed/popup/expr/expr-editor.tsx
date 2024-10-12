import { Resizable } from "re-resizable";
import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";
import { EdExprEditorRoot } from "./expr-editor-root";
import { PExpr } from "./lib/types";

export const EdExprEditor: FC<{
  children: any;
  value?: PExpr;
  onChange: (value: PExpr) => void;
  item_id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ children, open, onOpenChange }) => {
  const local = useLocal({ opened: false });

  useEffect(() => {
    if (typeof open !== "undefined") {
      local.opened = open;
      local.render();
    }
  }, [open]);

  if (!local.opened)
    return (
      <div
        className="flex flex-1 flex-row"
        onClick={() => {
          local.opened = true;
          onOpenChange?.(true);
          local.render();
        }}
      >
        {children}
      </div>
    );

  return (
    <Popover
      border="1px solid black"
      open={local.opened}
      backdrop={false}
      onOpenChange={(open) => {
        if (onOpenChange) {
          local.opened = open;
          onOpenChange(open);
          if (!open) {
            local.render();
          }
        } else {
          local.opened = open;
          local.render();
        }
      }}
      placement="left-start"
      content={
        <Resizable
          defaultSize={{
            width:
              parseInt(localStorage.getItem("prasi-expr-edit-w") || "") || 500,
            height:
              parseInt(localStorage.getItem("prasi-expr-edit-h") || "") || 250,
          }}
          minWidth={500}
          onResizeStop={(_, __, div) => {
            localStorage.setItem(
              "prasi-expr-edit-w",
              div.clientWidth.toString()
            );
            localStorage.setItem(
              "prasi-expr-edit-h",
              div.clientHeight.toString()
            );
          }}
          className={cx("text-sm")}
        >
          <EdExprEditorRoot />
        </Resizable>
      }
    >
      {children}
    </Popover>
  );
};
