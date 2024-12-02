import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { Info, Trash2 } from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { Tooltip } from "utils/ui/tooltip";
import { defaultEventFlow } from "./default-event";
import { EdEventTypes } from "./ed-event-types";

export const EdEventItem: FC<{
  type: string;
  node: PNode;
}> = ({ type, node }) => {
  const p = useGlobal(EDGlobal, "GLOBAL");
  const events = node.item.events || {};
  const event = EdEventTypes[type as keyof typeof EdEventTypes];
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
        <div className="flex-1 my-1">{type}</div>
        <Tooltip content={event.desc} className="cursor-pointer" delay={0}>
          <Info size={12} />
        </Tooltip>
      </div>
      <div
        className={cx(
          "flex flex-1 border-l justify-between",
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
        <div
          className={cx(
            "transition-all flex-1 m-1 border flex items-center justify-center text-xs cursor-pointer edit",
            events[type]
              ? "bg-blue-600 text-white hover:bg-blue-100 hover:text-blue-600"
              : "hover:bg-blue-600 hover:text-white"
          )}
          onClick={() => {
            if (!events[type]) {
              getActiveTree(p).update(`Assign Item ${type}`, ({ findNode }) => {
                const n = findNode(node.item.id);
                if (n) {
                  if (!n.item.events) {
                    n.item.events = {};
                  }
                  n.item.events[type] = { flow: defaultEventFlow(type) };
                }
              });
            }
          }}
        >
          {!events[type] ? "Assign Event" : "Edit Event"}
        </div>
        {events[type] && (
          <Tooltip
            content="Delete Event"
            onClick={() => {
              getActiveTree(p).update(`Remove Item ${type}`, ({ findNode }) => {
                const n = findNode(node.item.id);
                if (n) {
                  if (!n.item.events) {
                    n.item.events = {};
                  }
                  delete n.item.events[type];
                }
              });
            }}
            className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={14} />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
