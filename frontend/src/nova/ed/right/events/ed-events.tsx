import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { EdVarPicker } from "../vars/picker/picker-var";
import { EdEventItem } from "./ed-event-item";
import { EdEventTypes } from "./ed-event-types";
import { ChevronDown } from "lucide-react";

export const EdEvents = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  const item = node?.item;
  if (!item) return null;

  return (
    <div className="flex flex-col flex-1 select-none">
      <div className="text-sm flex flex-1 m-1 my-2 flex-col space-y-1">
        <div className="flex items-center">
          <div className="w-[90px]">Loop Items</div>
          <EdVarPicker>
            <div className="border pl-2 pr-[5px] cursor-pointer hover:bg-blue-600 hover:text-white flex items-center space-x-1">
              <div>None</div>
              <ChevronDown size={12} />
            </div>
          </EdVarPicker>
        </div>
        <div className="flex items-center">
          <div className="w-[90px]">Visible</div>
          <div className="border pl-2 pr-[5px] cursor-pointer hover:bg-blue-600 hover:text-white flex items-center space-x-1">
            <div>Yes</div>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
      <div className="flex flex-col border-t flex-1">
        {Object.entries(EdEventTypes).map(([event, item]) => {
          return <EdEventItem key={event} type={event} node={node} />;
        })}
      </div>
    </div>
  );
};
