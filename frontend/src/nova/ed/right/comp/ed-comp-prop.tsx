import { loadCompTree } from "crdt/load-comp-tree";
import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { ChevronDown, ChevronRight, Sticker } from "lucide-react";
import { waitUntil } from "prasi-utils";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { EdPropField } from "./prop-field/ed-prop-field";
import { sortProp } from "../../tree/parts/sort-prop";
import { propGroupInfo } from "../../tree/parts/prop-group-info";
import set from "lodash.set";

export const EdCompProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ comp_id: "", loading: false });
  const node = getActiveNode(p);
  const ui = p.ui.comp.prop;
  const comp_id = node?.item.component?.id || "";
  const comp_def = p.comp.loaded[comp_id];
  const comp = comp_def?.content_tree.component;
  const instance = node?.item?.component;
  useEffect(() => {
    if (local.comp_id !== comp_id) {
      if (!local.loading) {
        local.loading = true;
        local.comp_id = comp_id;

        if (p.comp.pending.has(comp_id)) {
          waitUntil(() => {
            return !p.comp.pending.has(comp_id);
          }).then(async () => {
            local.loading = false;
            local.render();

            const item = p.comp.loaded[comp_id].content_tree;
            if (!item.component && p.sync) {
              const tree = await loadCompTree({
                id: local.comp_id,
                p,
                sync: p.sync,
                activate: false,
              });
              tree.update("Prep Component", ({ tree }) => {
                tree.component = { id: comp_id, props: {} };
              });
              tree.destroy();
            }
          });
        } else {
          local.loading = false;
          local.render();
        }
      }
    }
  }, [comp_id]);

  if (!node || !instance || !comp || local.loading) {
    return (
      <div className="flex items-center justify-center flex-1 w-full text-sm h-full flex-col text-center space-y-1">
        <Sticker size={40} strokeWidth={1} />
        <div>
          {!node || !instance ? <>Not a component</> : <>Loading Component</>}
        </div>
      </div>
    );
  }

  const props = sortProp(comp.props);

  return (
    <div className="flex flex-1 text-sm flex-col items-stretch">
      {props.map(([key, field]) => {
        if (field.meta?.type === "content-element") return null;

        const { is_group, is_group_child, group_name, group_expanded } =
          propGroupInfo(p, [key, field], comp_id);

        if (is_group) {
          if (!is_group_child) {
            return (
              <div
                key={key}
                className={cx(
                  "border-b py-1 select-none flex items-center cursor-pointer hover:bg-blue-50"
                )}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!group_expanded) {
                    set(
                      p.ui.comp.prop.expanded,
                      `${comp_id}.${group_name}`,
                      true
                    );
                  } else {
                    set(
                      p.ui.comp.prop.expanded,
                      `${comp_id}.${group_name}`,
                      false
                    );
                  }

                  p.render();
                }}
              >
                {group_expanded ? (
                  <ChevronDown size={14} className="mx-1" />
                ) : (
                  <ChevronRight size={14} className="mx-1" />
                )}
                <div>{field.label}</div>
              </div>
            );
          } else {
            if (!group_expanded) {
              return null;
            } else {
              return (
                <div
                  key={key}
                  className={cx(css`
                    > div > .pl-3 {
                      border-left: 10px solid #ececeb;
                      padding-left: 5px;
                    }
                  `)}
                >
                  <EdPropField name={key} field={field} instance={instance} />
                </div>
              );
            }
          }
        }

        return (
          <EdPropField key={key} name={key} field={field} instance={instance} />
        );
      })}

      {ui.context_event && (
        <Menu
          mouseEvent={ui.context_event}
          onClose={() => {
            ui.context_event = null;
            ui.context_name = "";
            p.render();
          }}
        >
          <MenuItem
            label="Edit code"
            onClick={() => {
              ui.active = ui.context_name;
              p.ui.popup.script.open = true;
              p.render();
            }}
          />
        </Menu>
      )}
    </div>
  );
};
