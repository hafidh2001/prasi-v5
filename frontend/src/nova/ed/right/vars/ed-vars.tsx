import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";

export const EdVars = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);

  const item = node?.item;
  if (!item) return null;

  return (
    <div
      className={cx(
        "flex flex-col flex-1",
        css`
          .title {
            font-size: 80%;
            color: gray;
            padding: 5px;
          }
        `
      )}
    >
      <div className="title">Local Variables</div>
    </div>
  );
};
