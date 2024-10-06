import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { EdEventItem } from "./ed-event-item";
import { EventTypes } from "./ed-event-types";

export const EdEvents = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  const item = node?.item;
  if (!item) return null;

  const events = item.events || {};

  return (
    <div className="flex flex-col border-t mt-2 flex-1">
      {Object.entries(EventTypes).map(([event, item]) => {
        return <EdEventItem key={event} type={event} node={node} />;
      })}
    </div>
  );
};
