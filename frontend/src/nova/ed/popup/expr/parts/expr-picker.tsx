import { FC, ReactNode } from "react";
import { PExpr } from "../lib/types";
import { iconExpr } from "./expr-icon";
import { Trash, TriangleAlert } from "lucide-react";

export const EdExprPicker: FC<{
  value?: PExpr;
  onChange: (value: PExpr) => void;
  children?: ReactNode;
}> = ({ value, children }) => {
  return (
    <div
      className={cx(
        "cursor-pointer flex items-stretch",
        "border overflow-hidden",
        css`
          svg {
            width: 15px;
            height: 15px;
          }
        `
      )}
    >
      {value !== undefined ? (
        <div className="hover:bg-blue-600 hover:text-white text-blue-600 flex items-center pr-[5px]">
          <div className={cx("mx-1 flex justify-center")}>{iconExpr}</div>
          <div className="whitespace-nowrap text-sm">Edit Expression</div>
        </div>
      ) : (
        <>
          {children === undefined ? (
            <div className="bg-red-600 text-white hover:text-red-600 hover:bg-red-200 flex items-center pr-[5px]">
              <div className={cx("mx-1 flex justify-center ")}>
                <TriangleAlert />
              </div>
              <div className="whitespace-nowrap text-sm">Blank Expression</div>
            </div>
          ) : (
            children
          )}
        </>
      )}
      {value !== undefined && (
        <div
          className={cx(
            "flex items-center justify-center border-l w-[20px] text-red-600 hover:bg-red-600 hover:text-white"
          )}
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
};
