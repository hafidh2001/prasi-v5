import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { EdEventItem } from "./ed-event-item";
import { EdEventTypes } from "./ed-event-types";

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
          <div className="border px-3 cursor-pointer hover:bg-blue-600 hover:text-white">
            None
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[90px]">Visible</div>
          <div className="border px-3 cursor-pointer hover:bg-blue-600 hover:text-white">
            Yes
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
