import { loadCompTree } from "crdt/load-comp-tree";
import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { ChevronDown, ChevronRight, Sticker } from "lucide-react";
import { waitUntil } from "prasi-utils";
import { useCallback, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { EdPropField } from "./prop-field/ed-prop-field";
import { sortProp } from "../../tree/parts/sort-prop";
import { propGroupInfo } from "../../tree/parts/prop-group-info";
import set from "lodash.set";
import { getActiveTree } from "logic/active";

export const EdCompProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    comp_id: "",
    loading: false,
    hidden: {} as Record<string, boolean>,
    render_timeout: null as any,
  });
  const node = getActiveNode(p);
  const ui = p.ui.comp.prop;
  const comp_id = node?.item.component?.id || "";
  const comp_def = p.comp.loaded[comp_id];
  const comp = comp_def?.content_tree.component;
  const instance = node?.item?.component;
  const item = node?.item!;
  const should_re_eval_props = p.ui.comp.re_eval_item_ids.has(item?.id);

  useEffect(() => {
    if (should_re_eval_props && item) {
      if (!p.viref.comp_props) {
        p.viref.comp_props = {};
      }
      p.viref.resetCompInstance(item.id);
      p.ui.comp.re_eval_item_ids.delete(item.id);
      p.ui.comp.prop.render_prop_editor();
    }
  }, [should_re_eval_props]);

  p.ui.comp.prop.render_prop_editor = useCallback(
    (immediate) => {
      clearTimeout(local.render_timeout);
      const exec = async () => {
        local.loading = false;
        local.hidden = {};
        const item = node?.item;

        if (!p.comp.loaded[comp_id]) {
          await waitUntil(() => p.comp.loaded[comp_id]);
        }

        if (item && comp_def?.content_tree?.component) {
          if (!p.viref.comp_props) {
            await waitUntil(() => p.viref.comp_props);
          }

          const prop_values = p.viref.comp_props[item.id];
          const args = { ...prop_values };
          for (const [k, v] of Object.entries(
            comp_def.content_tree.component.props
          )) {
            if (v.visible) {
              const fn = new Function(
                ...Object.keys(args),
                `return ${v.visible}`
              );
              if (!fn(...Object.values(args))) {
                local.hidden[k] = true;
              }
            }
          }
        }
        local.render();
      };
      if (immediate) exec();
      else {
        local.render_timeout = setTimeout(exec, 50);
      }
    },
    [p.viref.comp_props?.[item.id]]
  );

  useEffect(() => {
    if (item && local.comp_id !== comp_id) {
      if (!local.loading) {
        local.loading = true;
        local.comp_id = comp_id;

        if (p.comp.pending.has(comp_id)) {
          waitUntil(() => {
            return !p.comp.pending.has(comp_id);
          }).then(async () => {
            p.ui.comp.prop.render_prop_editor(true);

            const item = p.comp.loaded[comp_id].content_tree;
            if (!item.component && p.sync) {
              const tree = await loadCompTree({
                id: local.comp_id,
                p,
                activate: false,
              });
              tree.update("Prep Component", ({ tree }) => {
                tree.component = { id: comp_id, props: {} };
              });
              tree.destroy();
            }
          });
        } else {
          p.ui.comp.prop.render_prop_editor(true);
        }
      }
    }
  }, [comp_id]);

  if (!item || !node || !instance || !comp || local.loading) {
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
      {props.map(([name, field]) => {
        if (local.hidden[name]) return null;
        if (field.meta?.type === "content-element") return null;

        const { is_group, is_group_child, group_name, group_expanded } =
          propGroupInfo(p, [name, field], comp_id);

        if (is_group) {
          if (!is_group_child) {
            return (
              <div
                key={name}
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
                  key={name}
                  className={cx(css`
                    > div > .pl-2 {
                      border-left: 10px solid #ececeb;
                      padding-left: 5px;
                    }
                  `)}
                >
                  <EdPropField name={name} field={field} instance={instance} />
                </div>
              );
            }
          }
        }

        return (
          <EdPropField
            key={name}
            name={name}
            field={field}
            instance={instance}
          />
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
          <MenuItem
            label="Reset to default"
            onClick={() => {
              getActiveTree(p).update(
                `Reset ${ui.context_name} Prop`,
                ({ findNode }) => {
                  const n = findNode(node.item.id);
                  if (n) {
                    const comp_prop =
                      comp_def.content_tree.component?.props[ui.context_name];
                    const prop = n.item.component?.props[ui.context_name];
                    if (prop && comp_prop) {
                      prop.value = comp_prop.value;
                      prop.valueBuilt = comp_prop.valueBuilt;
                    }
                  }
                }
              );
            }}
          />
        </Menu>
      )}
    </div>
  );
};
