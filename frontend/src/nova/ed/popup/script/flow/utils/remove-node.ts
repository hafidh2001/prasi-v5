import { Edge, NodeRemoveChange } from "@xyflow/react";
import { findFlow, loopPFNode } from "./find-node";
import { fg } from "./flow-global";

export const removeNodes = ({
  changes,
  edges,
  resetDefault,
}: {
  changes: NodeRemoveChange[];
  edges: Edge[];
  resetDefault: (relayout: boolean) => void;
}) => {
  fg.update(
    "Flow Remove Node",
    ({ pflow }) => {
      for (const c of changes) {
        const id = c.id;

        let found = findFlow({ pflow, id });
        while (found?.flow) {
          if (found.flow) {
            found.flow.splice(found.idx, 1);
          }
          found = findFlow({ pflow, id });
        }
        delete pflow.nodes[id];
        delete pflow.flow[id];
      }
    },
    ({ pflow }) => {
      if (Object.keys(pflow?.nodes || {}).length === 0) {
        resetDefault(true);
      }
    }
  );
};
