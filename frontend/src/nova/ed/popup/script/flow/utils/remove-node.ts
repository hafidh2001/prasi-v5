import { Edge, NodeRemoveChange } from "@xyflow/react";
import { findFlow } from "./find-node";
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
        const node = pflow.nodes[c.id];
        const node_branch = node?.branches
          ? node.branches.find((e) => e.flow.length > 0)?.flow
          : undefined;

        const target_id = edges
          .filter((e) => e.source === c.id)
          .map((e) => e.target)[0];

        delete pflow.nodes[c.id];
        delete pflow.flow[c.id];
        for (const node of Object.values(pflow.nodes)) {
          if (node.branches) {
            for (const branch of node.branches) {
              const idx = branch.flow.findIndex((e) => e === c.id);
              if (idx >= 0) {
                const spare_flow = branch.flow.splice(
                  idx,
                  branch.flow.length - idx
                );

                if (spare_flow.length > 1) {
                  pflow.flow[spare_flow[0]] = spare_flow;
                }
              }
            }
          }
        }

        const source_ids = edges
          .filter((e) => e.target === c.id)
          .map((e) => e.source);

        for (const source of source_ids) {
          const from = pflow.nodes[source];
          if (from) {
            if (from.branches) {
              const empty_branch = from.branches.find(
                (e) => e.flow.length === 0
              );
              if (empty_branch) {
                if (target_id) {
                  empty_branch.flow.push(from.id);
                  empty_branch.flow.push(target_id);
                }
              }
            } else {
              const source_flow = findFlow({ id: from.id, pflow: pflow });
              if (source_flow && source_flow.flow) {
                if (node_branch) {
                  for (const id of node_branch) {
                    if (!source_flow.flow?.includes(id))
                      source_flow.flow.push(id);
                  }
                } else if (target_id) {
                  if (!source_flow.flow.includes(target_id))
                    source_flow.flow.push(target_id);
                }
                for (let i = 0; i < source_flow.flow.length; i++) {
                  const id = source_flow.flow[i];
                  if (id === c.id) {
                    source_flow.flow.splice(i, 1);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    },
    ({ pflow }) => {
      if (Object.keys(pflow?.nodes || {}).length === 0) {
        resetDefault(true);
      }
    }
  );
};
