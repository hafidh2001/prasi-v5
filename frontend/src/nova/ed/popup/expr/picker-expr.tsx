import { active } from "logic/active";
import { Trash, TriangleAlert } from "lucide-react";
import { FC, ReactNode } from "react";
import { EdExprEditor } from "./expr-editor";
import { PExpr } from "./lib/types";
import { iconExpr } from "./parts/expr-icon";

export const EdExprPicker: FC<{
  value?: PExpr;
  onChange: (value?: PExpr) => void;
  empty?: ReactNode;
  open?: boolean;
  onOpenChange: (open?: boolean) => void;
}> = ({ value, empty, onChange, open, onOpenChange }) => {
  const content = (
    <div
      className={cx(
        "cursor-pointer flex items-stretch",
        "border overflow-hidden",
        css`
          svg {
            width: 15px;
            height: 15px;
          }
          > div {
            padding-top: 3px;
            padding-bottom: 3px;
          }
        `
      )}
      onClick={(e) => {
        onOpenChange(true);
      }}
    >
      {value !== undefined ? (
        <div className="hover:bg-blue-600 hover:text-white text-blue-600 flex items-center pr-[5px] pl-1">
          <div className={cx("mx-1 flex justify-center")}>{iconExpr}</div>
          <div className="whitespace-nowrap text-sm">Edit Expression</div>
        </div>
      ) : (
        <>
          {empty === undefined ? (
            <div className="bg-red-600 text-white hover:text-red-600 hover:bg-red-200 flex items-center pr-[5px] pl-1">
              <div className={cx("mx-1 flex justify-center ")}>
                <TriangleAlert />
              </div>
              <div className="whitespace-nowrap text-sm">Blank Expression</div>
            </div>
          ) : (
            <div className="px-1 pl-2 hover:bg-blue-600 hover:text-white flex items-center space-x-1">
              {empty}
            </div>
          )}
        </>
      )}
      {value !== undefined && (
        <div
          className={cx(
            "flex items-center justify-center border-l w-[25px] text-red-600 hover:bg-red-600 hover:text-white"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onChange(undefined);
          }}
        >
          <Trash
            size={12}
            className={css`
              width: 12px !important;
              height: 12px !important;
            `}
          />
        </div>
      )}
    </div>
  );

  if (!open) {
    return content;
  }
  return (
    <EdExprEditor
      value={value}
      onChange={(expr) => onChange(expr)}
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
      item_id={active.item_id}
    >
      {content}
    </EdExprEditor>
  );
};
