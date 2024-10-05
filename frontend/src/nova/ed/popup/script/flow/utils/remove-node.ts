import { Edge, NodeRemoveChange } from "@xyflow/react";
import { RPFlow } from "../runtime/types";
import { findFlow } from "./find-node";
import { fg } from "./flow-global";

export const removeNodes = ({
  pflow,
  changes,
  edges,
  resetDefault,
}: {
  pflow: RPFlow;
  changes: NodeRemoveChange[];
  edges: Edge[];
  resetDefault: (relayout: boolean) => void;
}) => {
  if (Object.keys(pflow?.nodes || {}).length === changes.length) {
    setTimeout(() => {
      resetDefault(true);
    }, 100);
  } else {
    fg.update("Flow Remove Node", ({ pflow }) => {
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
    });
  }
};
