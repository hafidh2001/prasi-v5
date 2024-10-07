import { Trash2 } from "lucide-react";
import { Resizable } from "re-resizable";
import { FC } from "react";
import { IVar } from "utils/types/item";
import { Tooltip } from "utils/ui/tooltip";
import { EdTypeLabel } from "./lib/label";
import { EObjectEntry, EType } from "./lib/type";
import { EdVarPicker } from "./picker/picker";

const DEPTH_PX = 6;
export const EdVarEdit: FC<{
  variable: IVar<any>;
  onChange: (arg: {
    path: string;
    type: EType | EObjectEntry | undefined;
  }) => void;
  onRename: (arg: {
    path: string[];
    new_name: string;
    old_name: string;
  }) => void;
}> = ({ variable, onChange, onRename }) => {
  const size = localStorage.getItem("prasi-var-edit-size") || "400*700";
  const [height, width] = size.split("*").map(Number);
  return (
    <Resizable
      defaultSize={{
        height,
        width,
      }}
      className={cx(
        "flex text-sm ",
        css`
          min-width: 700px;
        `
      )}
      onResizeStop={(_, __, div) => {
        localStorage.setItem(
          "prasi-var-edit-size",
          div.clientHeight.toString() + "*" + div.clientWidth.toString()
        );
      }}
    >
      <div className="flex flex-1 relative overflow-auto border-r ">
        <pre className="absolute inset-0 whitespace-pre-wrap text-[7px] monospace leading-3">
          {JSON.stringify(variable, null, 2)}
        </pre>
      </div>
      <div className="flex flex-1 relative overflow-auto">
        <div className="absolute inset-0 flex flex-col flex-1 select-none">
          <EdVarPicker
            type={variable.type}
            onChange={(path, type) => {
              onChange({ path: path.join("."), type });
            }}
            path={["~~"]}
          >
            {({ Item, open, type, Lines, depth, name, Rename, path }) => (
              <div className={cx("flex flex-1 flex-col items-stretch")}>
                <div
                  className={cx(
                    "flex items-stretch relative cursor-pointer border-b ",
                    css`
                      padding-left: ${(depth - 1) * DEPTH_PX}px;
                    `
                  )}
                  onClick={open}
                >
                  {name ? (
                    <div className="flex justify-between flex-1">
                      <div className="flex items-stretch text-sm flex-1">
                        <Item
                          className={cx(
                            "flex h-[30px]",
                            css`
                              .text {
                                font-size: 90%;
                                margin-left: 3px;
                              }
                            `
                          )}
                        >
                          <EdTypeLabel type={type} />
                        </Item>
                        <div className="flex-1 flex items-center">
                          <Rename name={name} onRename={onRename} />
                        </div>
                        <Tooltip
                          content="Delete Property"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange({
                              path: path.slice(0, path.length - 1).join("."),
                              type: undefined,
                            });
                          }}
                          className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <Item
                      className={cx(
                        "px-1 flex pr-2 h-[30px]",
                        css`
                          .text {
                            font-size: 90%;
                            margin-left: 3px;
                          }
                        `
                      )}
                    >
                      <EdTypeLabel type={type} show_label />
                    </Item>
                  )}
                </div>
                <div className={cx("flex flex-col")}>
                  <Lines
                    className={css`
                      padding-left: ${depth * DEPTH_PX}px;
                    `}
                  />
                </div>
              </div>
            )}
          </EdVarPicker>
        </div>
      </div>
    </Resizable>
  );
};
