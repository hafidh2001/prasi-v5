import { Edge } from "@xyflow/react";
import { Split } from "lucide-react";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { RPFlow } from "../runtime/types";
import { fg } from "../utils/flow-global";

export const PFPropEdge: FC<{ edge: Edge; pflow: RPFlow }> = ({
  edge,
  pflow,
}) => {
  const local = useLocal({ selected_idx: -1 });
  const node = pflow.nodes[edge.source];
  if (!node) return <></>;

  return (
    <div className="flex flex-col text-xs">
      {node.branches && (
        <>
          <div className="flex items-center p-1 border-b px-1 space-x-1">
            <Split size={9} />
            <div>Change Branch:</div>
          </div>
          <div>
            {(node.branches || []).map((e, idx) => {
              const selected = e.flow.includes(edge.target);
              if (selected) local.selected_idx = idx;
              return (
                <div
                  key={idx}
                  className={cx(
                    "pl-4 py-1 select-none",
                    selected
                      ? "cursor-default bg-blue-500 text-white"
                      : "cursor-pointer hover:bg-blue-50"
                  )}
                  onClick={() => {
                    if (local.selected_idx !== idx) {
                      fg.update("Flow Change Branch", ({ pflow }) => {
                        const n = pflow.nodes[node.id];
                        const e = n.branches![idx];
                        const temp = n.branches![local.selected_idx].flow;
                        n.branches![local.selected_idx].flow = e.flow;
                        e.flow = temp;
                      });
                    }
                  }}
                >
                  {e.name || "Branch " + (idx + 1)}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
