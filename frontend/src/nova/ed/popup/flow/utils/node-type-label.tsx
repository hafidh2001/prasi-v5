import { getNodeDef } from "./get-node-def";

export const NodeTypeLabel: React.FC<{ node: { type: string } }> = ({
  node,
}) => {
  const def = getNodeDef(node.type);
  const type = def?.type || node.type;

  return type.split(".").map((e, idx) => (
    <div key={idx} className="flex space-x-1 ml-1">
      {idx > 0 && <div> &bull; </div>}
      <div className={e.length > 2 ? "capitalize" : "uppercase"}>{e}</div>
    </div>
  ));
};
