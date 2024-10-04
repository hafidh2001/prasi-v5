import { Edge, NodeRemoveChange } from "@xyflow/react";
import { findFlow, loopPFNode } from "./find-node";
import { fg } from "./flow-global";
import { current } from "immer";

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

            if (found.flow.length <= 1) {
              const node = pflow.nodes[found.flow[0]];
              if (node && node.branches && found.branch) {
                const idx = node.branches.indexOf(found.branch);
                node.branches.splice(idx, 1);
              }
            }
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
