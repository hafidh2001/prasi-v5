import { allNodeDefinitions } from "../runtime/nodes";
import { PFNodeDefinition } from "../runtime/types";

export const NodeTypeLabel: React.FC<{ node: { type: string } }> = ({
  node,
}) => {
  const def = (allNodeDefinitions as any)[node.type] as PFNodeDefinition<any>;
  const type = def?.type || node.type;

  return type.split(".").map((e, idx) => (
    <div key={idx} className="flex space-x-1 ml-1">
      {idx > 0 && <div> &bull; </div>}
      <div className={e.length > 2 ? "capitalize" : "uppercase"}>{e}</div>
    </div>
  ));
};
