import { PNode } from "logic/types";
import { Trash2 } from "lucide-react";
import { FC } from "react";

export const EdEventItem: FC<{
  type: string;
  node: PNode;
}> = ({ type, node }) => {
  const events = node.item.events || {};
  return (
    <div
      className={cx(
        "border-b flex text-sm flex-stretch select-none",
        css`
          min-height: 24px;
        `
      )}
    >
      <div
        className={cx(
          "px-1 flex items-center relative",
          css`
            min-width: 80px;
          `
        )}
      >
        <div>{type}</div>
      </div>
      <div
        className={cx(
          "p-1 flex flex-1 border-l justify-between",
          !events[type] &&
            css`
              .edit {
                opacity: 0;
              }
              &:hover {
                .edit {
                  opacity: 1;
                }
              }
            `
        )}
      >
        <div className="transition-all border px-3 text-xs hover:bg-blue-600 hover:text-white cursor-pointer edit">
          Edit
        </div>
        {events[type] && (
          <div className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-100">
            <Trash2 size={14} />
          </div>
        )}
      </div>
      {/* <div
        className={cx(
          " px-6 flex items-center border-l hover:bg-blue-600 hover:text-white cursor-pointer justify-center"
        )}
      >
        Edit
      </div>
      <div className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-100">
        <Trash2 size={14} />
      </div> */}
    </div>
  );
};
