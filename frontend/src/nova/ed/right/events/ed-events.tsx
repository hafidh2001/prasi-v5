import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  Bolt,
  ChevronDown,
  Network,
  RectangleEllipsis,
  Trash,
} from "lucide-react";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { IFlowOrVar } from "utils/types/item";
import { Popover } from "utils/ui/popover";
import { EdVarLabel } from "../vars/lib/var-label";
import { EdVarPicker } from "../vars/picker/picker-var";
import { EdEventItem } from "./ed-event-item";
import { EdEventTypes } from "./ed-event-types";

export const EdEvents = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  const item = node?.item;
  if (!item) return null;

  return (
    <div className="flex flex-col flex-1 select-none">
      <div className="text-sm flex flex-1 m-1 my-2 flex-col space-y-1 items-stretch">
        <div className="flex items-center">
          <div className="w-[90px] mr-1">Content</div>
          {node.item.loop ? (
            <div className=" text-slate-500 flex items-center h-[25px]">
              Using Loop Items
            </div>
          ) : (
            <Picker
              value={node.item.content}
              onChange={(value) => {
                getActiveTree(p).update("Edit Item Content", ({ findNode }) => {
                  const n = findNode(item.id);
                  if (n) {
                    n.item.content = value;
                  }
                });
              }}
              open={p.ui.popup.events.open === "content"}
              onOpenChange={(open) => {
                if (open) p.ui.popup.events.open = "content";
                else p.ui.popup.events.open = "";
                p.render();
              }}
              empty={<>Children</>}
            ></Picker>
          )}
        </div>
        <div className="flex items-center">
          <div className="w-[90px] mr-1">Loop Items</div>

          <Picker
            value={node.item.loop}
            onChange={(value) => {
              getActiveTree(p).update("Edit Item Content", ({ findNode }) => {
                const n = findNode(item.id);
                if (n) {
                  n.item.loop = value;
                }
              });
            }}
            empty={<div className="text-slate-400">Empty</div>}
            open={p.ui.popup.events.open === "loop"}
            onOpenChange={(open) => {
              if (open) p.ui.popup.events.open = "loop";
              else p.ui.popup.events.open = "";
              p.render();
            }}
          ></Picker>
        </div>
      </div>
      <div className="flex flex-col border-t flex-1">
        {Object.entries(EdEventTypes).map(([event]) => {
          return <EdEventItem key={event} type={event} node={node} />;
        })}
      </div>
    </div>
  );
};

const Picker: FC<{
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
        value && "border border-blue-500"
      )}
    >
      {value && (
        <div
          className={cx(
            "pr-[5px] cursor-pointer hover:bg-blue-600 hover:text-white flex items-center space-x-1",
            "border overflow-hidden"
          )}
        >
          {value.mode === "var" && (
            <>
              <EdVarLabel value={value.var} empty={<>Edit Variable</>} />
            </>
          )}
          {value.mode === "flow" && (
            <>
              <Network size={12} className="mr-1 ml-2" />
              Edit Flow
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
                icon: <RectangleEllipsis size={12} className="mr-1" />,
                active: value?.mode === "var",
                onClick: () => {
                  onOpenChange(false);
                  onChange({ ...value, mode: "var" });
                },
              },
              {
                name: "Use Flow",
                icon: <Network size={12} className="mr-1" />,
                active: value?.mode === "flow",
                onClick: () => {
                  onChange({ ...value, mode: "flow" });
                },
              },
              !!value
                ? {
                    name: "Clear",
                    icon: <Trash size={12} className="mr-1" />,
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
                    "flex py-1 px-3 border-b items-center  cursor-pointer",
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
                  {e.icon}
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

  return content;
};
