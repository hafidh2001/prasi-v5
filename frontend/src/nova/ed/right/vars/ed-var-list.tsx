import { getActiveNode } from "crdt/node/get-node-by-id";
import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PlusCircle } from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { EdVarItem } from "./ed-var-item";
import { Tooltip } from "utils/ui/tooltip";

export const EdVarList = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const node = getActiveNode(p);
  const local = useLocal({ add: { focus: false, text: "" } });

  const item = node?.item;
  if (!item) return null;

  return (
    <div
      className={cx(
        "flex flex-col flex-1 text-sm",
        css`
          .title {
            font-size: 90%;
            color: gray;
            padding: 5px;
          }
        `
      )}
    >
      {item.vars &&
        Object.keys(item.vars).map((name) => {
          return <EdVarItem key={name} name={name} node={node} />;
        })}
      <Tooltip
        content={
          <>
            Press{" "}
            <b className="font-bold font-mono text-[9px] mx-[2px]">[ENTER]</b>{" "}
            to add variable
          </>
        }
        asChild
        placement="left"
        open={!!local.add.text}
      >
        <div className="border-b px-1">
          <div
            className={cx(
              "flex items-center space-x-1",
              local.add.focus && "border-blue-500"
            )}
          >
            <PlusCircle size={12} />
            <input
              type="text"
              placeholder="Add Variable"
              value={local.add.text}
              className="flex-1 outline-none p-1"
              spellCheck={false}
              onChange={(e) => {
                local.add.text = e.target.value
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9]/g, "_");
                local.render();
              }}
              onFocus={() => {
                local.add.focus = true;
                local.render();
              }}
              onBlur={() => {
                if (local.add.text) {
                  const text = local.add.text;
                  getActiveTree(p).update(
                    "Add Variable: " + text,
                    ({ findNode }) => {
                      const n = findNode(item.id);
                      if (n) {
                        if (!n.item.vars) {
                          n.item.vars = {};
                        }
                        const vars = n.item.vars;

                        vars[text] = {
                          type: {},
                          promise: false,
                          history: { type: {}, value: {} },
                        };
                      }
                    }
                  );

                  p.ui.popup.vars.name = text;
                  local.add.text = "";
                  local.add.focus = false;
                  p.render();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
};
