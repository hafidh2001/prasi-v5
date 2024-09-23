import { FC } from "react";
import { PFField, PFlow, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import { getNodeFields } from "../utils/get-node-fields";
import { savePF } from "../utils/save-pf";
import { PFPropNodeField } from "./pf-prop-node-field";
import { useLocal } from "utils/react/use-local";

export const PFPropNode: FC<{ node: PFNode; pflow: PFlow }> = ({
  node,
  pflow,
}) => {
  const field = getNodeFields(node);
  const local = useLocal({ name: node.name, rename_timeout: null as any });

  const def = field?.definition;
  if (!def) return null;
  return (
    <>
      {node.type !== "start" && (
        <input
          type="text"
          spellCheck={false}
          value={local.name || ""}
          id={"prasi-flow-node-name"}
          className={cx("px-1 pt-3 pb-2 text-lg outline-none border-b ")}
          onChange={(e) => {
            const value = e.currentTarget.value;
            local.name = value;
            local.render();

            clearTimeout(local.rename_timeout)
            local.rename_timeout = setTimeout(() => {
              fg.update("Flow Rename node", ({ pflow }) => {
                const n = pflow.nodes[node.id];
                if (n) {
                  n.name = value;
                }
              });
            }, 500);
          }}
          placeholder={"Node Name"}
        />
      )}
      <div className="text-xs text-slate-400 p-1 border-b">ID: {node.id}</div>

      {Object.entries((def.fields || {}) as Record<string, PFField>)
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, item]) => {
          return (
            <PFPropNodeField
              pflow={pflow}
              key={key}
              field={item}
              name={key}
              node={node}
              value={node[key]}
            />
          );
        })}
      <pre className={cx("text-[9px]")}>{JSON.stringify(node, null, 2)}</pre>
    </>
  );
};
