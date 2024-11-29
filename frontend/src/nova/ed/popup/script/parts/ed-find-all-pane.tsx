import { ScriptModel } from "crdt/node/load-script-models";
import { activateItem, active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { AutoHeightTextarea } from "utils/ui/auto-textarea";
import { formatItemName } from "../../../tree/parts/node/node-name";
import { ChevronRight } from "lucide-react";
import { extractRegion } from "../code/js/migrate-code";

export const EdCodeFindAllPane: FC<{}> = ({}) => {
  const local = useLocal(
    {
      timeout: null as any,
      found: {} as Record<string, { line: number; text: string[] }[]>,
      count: 0,
      models: {} as Record<string, ScriptModel>,
      nodes: {} as Record<string, PNode>,
    },
    async () => {
      const tree = getActiveTree(p);
      local.models = tree.script_models;
      local.nodes = tree.nodes.map;
      local.render();
      if (p.script.search.text) {
        setTimeout(() => {
          searchAll();
        }, 100);
      }
    }
  );
  const p = useGlobal(EDGlobal, "EDITOR");
  const searchAll = () => {
    if (!p.script.search.text) {
      local.found = {};
      local.render();
      return;
    }
    const search = new RegExp(p.script.search.text, "ig");
    const models = local.models;

    local.found = {};
    local.count = 0;
    for (const model of Object.values(models)) {
      const region = extractRegion(model.source);
      const result = model.source.replaceAll(search, (arg) => {
        return `[/FOUND/[${arg}]/FOUND/]`;
      });
      if ((result || []).length > 1) {
        const found = [];
        const lines = result.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (i <= region.length) continue;
          const line = lines[i];
          if (line.includes(`[/FOUND/[`)) {
            local.count++;
            const parts = line.split("[/FOUND/[");
            const found_line = [];
            for (const part of parts) {
              if (part.includes("]/FOUND/]")) {
                const ends = part.split("]/FOUND/]");
                for (const e of ends) {
                  found_line.push(e);
                }
              } else {
                found_line.push(part);
              }
            }
            found.push({ line: i, text: found_line });
          }
        }
        if (found.length > 0) {
          local.found[model.id] = found;
        }
      }
    }
    local.render();
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b flex flex-col text-sm">
        <div className="flex items-stretch">
          <div className="w-[60px] p-1 border-r">Search</div>
          <AutoHeightTextarea
            className="flex-1 p-1 outline-none"
            spellCheck={false}
            onBlur={() => {}}
            value={p.script.search.text}
            onChange={(e) => {
              p.script.search.text = e.currentTarget.value;
              local.render();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchAll();
              }
            }}
          />
        </div>
        {/* <div className="flex items-stretch">
          <div className="w-[60px] p-1 border-r">Replace</div>
          <AutoHeightTextarea
            className="flex-1 p-1 outline-none"
            spellCheck={false}
          />
        </div> */}
      </div>
      {p.script.search.text && (
        <div className="bg-blue-500 text-white px-1 py-2 text-xs">
          Result: {Object.keys(local.found).length} items found
        </div>
      )}
      <div className="flex-1 relative overflow-auto">
        <div className="absolute inset-0 text-sm">
          {Object.entries(local.found).map(([id, found], idx) => {
            let model = local.models[id];

            let item_id = model.id;
            if (item_id.includes("~")) {
              item_id = item_id.split("~")[0];
            }
            const node = local.nodes[item_id];
            if (!node) return null;
            return (
              <div key={id} className="flex flex-col">
                <div className="p-1 border-b flex items-center">
                  <span>{formatItemName(node.item?.name)}</span>
                  {model.prop_name ? (
                    <span className="flex-1 flex items-center">
                      &nbsp; <ChevronRight size={14} /> {model.prop_name}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex flex-col">
                  {found.map((f, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex border-l-[10px] border-b text-xs cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          if (model.prop_name) {
                            p.ui.comp.prop.active = model.prop_name;
                          }
                          if (active.item_id !== item_id) {
                            activateItem(p, item_id);
                          }
                          setTimeout(() => {
                            const ed = p.script.editor;
                            if (ed) {
                              ed.setSelection({
                                startColumn: f.text[0].length + 1,
                                endColumn:
                                  f.text[1].length + f.text[0].length + 1,
                                startLineNumber: f.line + 1,
                                endLineNumber: f.line + 1,
                              });
                              ed.focus();
                            }
                          }, 300);
                        }}
                      >
                        <div className="border-r min-w-[30px] text-center p-1">
                          {f.line + 1}
                        </div>
                        <div className="ml-2 inline py-1 ">
                          {f.text.map((t, idx) => (
                            <span
                              key={idx}
                              className={cx(
                                idx > 0 &&
                                  idx < f.text.length - 1 &&
                                  idx % 2 !== 0 &&
                                  "bg-blue-500 text-white"
                              )}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
