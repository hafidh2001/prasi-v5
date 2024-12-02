import get from "lodash.get";
import { active, getActiveTree } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  PlusCircle,
  Trash,
  X,
} from "lucide-react";
import { codeUpdate } from "popup/script/code/prasi-code-update";
import { FC, Fragment, useEffect, useRef } from "react";
import { arrayMove, List } from "react-movable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { Dropdown } from "utils/ui/dropdown";
import { FieldCode } from "../../../../tree/master-prop/ed-mp-fields";
import { extractValue } from "./extract-value";
import {
  createListItem,
  getPropStructureByPath,
  getPropValueByPath,
  ListLayout,
  ListStructure,
  LSObject,
  LSString,
  parsePLValue,
  PLCode,
  PLObject,
  PLString,
  plStringifySingle,
  PLValue,
} from "./prop-list/prop-list-util";
import { Popover } from "utils/ui/popover";
import { getActiveNode } from "crdt/node/get-node-by-id";

type PROP_NAME = string;

const prop_list = {} as Record<PROP_NAME, PropListSingle>;
type PropListSingle = {
  layout?: ListLayout;
  structure: ListStructure;
  value: PLValue[];
  expand: boolean;
  ctx_path: (string | number)[];
  ctx_menu: any;
  render_head: () => void;
  render_list: () => void;
};

export const EdPropListHead = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ add_new_timeout: null as any });
  const { name } = arg;

  useEffect(() => {
    for (const k of Object.keys(prop_list)) {
      delete prop_list[k];
    }
    local.render();
  }, [active.item_id]);

  useEffect(() => {
    const exports = p.viref.vscode_exports || {};

    const options = new Function(
      ...Object.keys(exports),
      `return ${arg.field.meta?.optionsBuilt || ""}`
    );

    let prop = arg.instance.props[name];
    const extracted = extractValue(p, name, prop);

    if (extracted) {
      const options_result = options(...Object.values(exports)) as {
        structure: ListStructure;
        layout?: ListLayout;
      };

      const expanded = localStorage.getItem(`prasi-prop-list-${name}`);
      prop_list[name] = {
        layout: options_result.layout,
        expand: expanded !== "collapsed",
        structure: options_result.structure,
        value: parsePLValue(extracted.value),
        ctx_menu: null,
        ctx_path: [],
        render_head: local.render,
        render_list: () => {},
      };
    }
    local.render();
    p.ui.comp.prop.render_prop_editor();
  }, [arg.instance.props[name]?.value, p.viref.comp_props[active.item_id]]);

  const prop = prop_list[name];
  if (!prop) return null;

  return (
    <>
      <div
        className={cx("flex items-center justify-between px-1 flex-1")}
        onClick={() => {
          prop.expand = prop.expand === undefined ? false : !prop.expand;
          localStorage.setItem(
            `prasi-prop-list-${name}`,
            prop.expand ? "expanded" : "collapsed"
          );
          p.render();
        }}
      >
        <div
          className={cx(
            "text-[10px] bg-white ml-1 px-1 flex items-center transition-all "
          )}
        >
          <div className="pr-2 py-1 flex items-center">
            <div className="rounded-[2px] bg-blue-500 h-[14px] flex items-center px-1 text-white">
              {prop.value.length}
            </div>
          </div>
          {(prop.expand || typeof prop.expand === "undefined") && (
            <>
              <ChevronDown size={13} />
            </>
          )}

          {prop.expand === false && (
            <>
              <ChevronRight size={13} />
            </>
          )}
        </div>
        <div
          className="border pl-[3px] pr-[6px] flex items-center space-x-1 hover:bg-blue-600 hover:text-white rounded-sm text-xs bg-white"
          onClick={(e) => {
            e.stopPropagation();
            const item = createListItem(prop.structure);
            prop.value.push(item as any);
            local.render();
            prop.render_list();

            const source = `[\n${prop.value.map((e) => plStringifySingle(e)).join(",\n")}\n]`;

            getActiveTree(p).update(
              `${"Add Item to Prop "} ${name}`,
              ({ findNode }) => {
                const n = findNode(active.item_id);

                if (n && n.item.component?.props) {
                  n.item.component.props[name].value = source;
                  n.item.component.props[name].valueBuilt =
                    n.item.component.props[name].value;
                }
              }
            );
          }}
        >
          <PlusCircle size={11} /> <div className="mt-[2px]">Add New</div>
        </div>
      </div>
    </>
  );
};

export const EdPropList = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ activeIdx: -1 });
  const container = useRef<HTMLDivElement>(null);

  const name = arg.name;
  const prop = prop_list[name];
  if (!prop || (prop && (!prop.expand || !prop.structure))) return null;

  prop.render_list = local.render;

  const update = () => {
    prop.render_head();
    local.render();
    const source = `export const ${name} = [\n${prop.value
      .map((e) => plStringifySingle(e))
      .join(",\n")}\n]`;

    const comp_name =
      p.comp.loaded[getActiveNode(p)?.item.component?.id || ""].content_tree
        .name || "";
    codeUpdate.push(p, active.item_id, source, {
      action_name: `Updated: [${comp_name}] ~> ${name}`,
      prop_name: name,
    });

    p.ui.comp.prop.render_prop_editor(true);
  };

  let ctx_menu = null as null | PLValue;
  if (prop.ctx_menu) {
    ctx_menu = getPropValueByPath(prop.value, prop.ctx_path);
  }

  const root_layout = prop.layout?.[""];
  return (
    <div
      className={cx("flex items-stretch flex-col flex-1 bg-white")}
      ref={container}
    >
      {prop.ctx_menu && (
        <Menu
          mouseEvent={prop.ctx_menu}
          onClose={() => {
            prop.ctx_menu = null;
            p.render();
          }}
        >
          <div
            className="flex items-center px-1 text-[10px] space-x-[2px] border-b pointer-events-none"
            tabIndex={undefined}
          >
            <div>{name}</div>
            <ChevronRight size={10} />
            {prop.ctx_path.map((e, idx) => {
              return (
                <Fragment key={idx}>
                  <div>{typeof e === "number" ? e + 1 : e}</div>
                  {idx < prop.ctx_path.length - 1 && <ChevronRight size={10} />}
                </Fragment>
              );
            })}
          </div>
          {ctx_menu?.type !== "code" && (
            <MenuItem
              label="Convert to Code"
              onClick={() => {
                if (ctx_menu) {
                  ctx_menu.value = `(${plStringifySingle(ctx_menu)})`;
                  (ctx_menu as any).type = "code";
                  update();
                }
              }}
            />
          )}
          <MenuItem
            label="Reset"
            onClick={() => {
              const st = getPropStructureByPath(prop.structure, prop.ctx_path);

              if (st) {
                const blank_value = createListItem(st);
                for (const [k, v] of Object.entries(blank_value)) {
                  (ctx_menu as any)[k] = v;
                }
                update();
              }
            }}
          />
        </Menu>
      )}
      <List
        container={container.current}
        lockVertically
        onChange={({ oldIndex, newIndex }) => {
          prop.value = arrayMove(prop.value, oldIndex, newIndex);
          update();
        }}
        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
        values={prop.value}
        renderItem={({ value: item, props, index }) => (
          <li
            {...props}
            key={props.key}
            tabIndex={undefined}
            className={cx(
              "relative text-sm flex items-stretch bg-white",
              css`
                &:hover > .grip {
                  background: #acccff;
                  color: white;
                }
              `
            )}
            onContextMenu={(e) => {
              contextMenu(e, prop, [index!], p);
            }}
            onClick={() => {
              if (typeof index === "number") {
                local.activeIdx = index;
                local.render();
              }
            }}
          >
            <Fragment key={1}>
              <div
                className={cx(
                  "grip w-[15px] cursor-ns-resize flex items-center justify-center border-r",
                  local.activeIdx === index &&
                    css`
                      background: #3c82f6 !important;
                      color: white;
                    `
                )}
              >
                <GripVertical size={10} />
              </div>
              <div
                className="flex-1"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {root_layout ? (
                  root_layout({
                    structure: prop.structure,
                    value: item,
                    update: (key, value) => {
                      console.log(key, value);
                    },
                  })
                ) : (
                  <>
                    {prop.structure.type === "string" && (
                      <SString
                        structure={prop.structure}
                        value={item as PLString}
                        prop={prop}
                        path={[index!]}
                        onChange={(e) => {
                          if (typeof index === "number") {
                            prop.value[index] = { type: "string", value: e };
                            prop.value = [...prop.value];
                            update();
                          }
                        }}
                      />
                    )}

                    {prop.structure.type === "object" && (
                      <SObject
                        structure={prop.structure}
                        value={item as PLObject}
                        prop={prop}
                        path={[index!]}
                        onChange={(e) => {
                          if (typeof index === "number") {
                            prop.value[index] = { type: "object", value: e };
                            prop.value = [...prop.value];
                            update();
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <div
                className="cursor-pointer flex items-center justify-center border-l w-[20px] text-red-600 hover:bg-red-50"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={() => {
                  if (typeof index === "number") {
                    prop.value.splice(index, 1);
                    update();
                  }
                }}
              >
                <Trash size={12} />
              </div>
            </Fragment>
            <div
              key={2}
              className="border-b absolute -left-[2px] -right-[2px] bottom-0"
            ></div>
          </li>
        )}
      />
    </div>
  );
};

const SString: FC<{
  structure: LSString;
  value: PLString | PLCode;
  path: (string | number)[];
  prop: PropListSingle;
  onChange: (val: string) => void;
}> = (arg) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const { structure: s, value, onChange } = arg;
  const local = useLocal({ value: value?.value || "", focus: false });

  useEffect(() => {
    if (
      !local.focus &&
      typeof value === "object" &&
      typeof value?.value === "string"
    ) {
      local.value = value.value;
      local.render();
    }
  }, [value]);

  return (
    <div
      className="flex-1 flex"
      onContextMenu={(e) => {
        contextMenu(e, arg.prop, arg.path, p);
      }}
    >
      {value?.type !== "code" ? (
        <>
          {s.options ? (
            <>
              <Dropdown
                items={s.options}
                className="flex-1 outline-none rounded-none px-1 py-[2px]"
                value={local.value}
                onChange={(v) => {
                  local.value = v;
                  local.render();
                  onChange(v);
                }}
              />
            </>
          ) : (
            <input
              type="text"
              disabled={s.disabled === true}
              className={cx(
                "flex-1 outline-none rounded-none px-1 py-[2px]",
                s.disabled && "text-black"
              )}
              value={local.value || ""}
              placeholder={s.placeholder}
              onClick={(e) => {
                e.currentTarget.select();
              }}
              onFocus={() => {
                local.focus = true;
                local.render();
              }}
              onBlur={() => {
                local.focus = false;
                local.render();
              }}
              spellCheck={false}
              onChange={(e) => {
                local.value = e.currentTarget.value;
                local.render();
                onChange(e.currentTarget.value);
              }}
            />
          )}
        </>
      ) : (
        <SCode
          onChange={onChange}
          value={value as any}
          path={arg.path}
          prop={arg.prop}
        />
      )}
    </div>
  );
};

const SObject: FC<{
  structure: LSObject;
  value: PLValue;
  path: (string | number)[];
  prop: PropListSingle;
  onChange: (val: any) => void;
}> = (arg) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const { structure: s, value, onChange } = arg;
  const local = useLocal({ deleted: new Set<string>() });
  let cur = value as any;
  if (typeof value !== "object") {
    cur = {};
  } else if (cur.value) {
    cur = cur.value;
  }

  useEffect(() => {
    local.render();
  }, [local.deleted.size]);

  let deleted_popup_rendered = false;
  return (
    <div
      className="flex-1 flex flex-col"
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {value.type !== "code" ? (
        <>
          {Object.entries(s.object).map(([name, st], idx) => {
            const curval = get(cur, name);

            let label = name;
            let deletable = false;
            if (st.type === "string") {
              if (typeof st.label === "string") label = st.label;
              if (typeof st.deletable === "boolean") deletable = st.deletable;
            }

            if (deletable && !curval) {
              local.deleted.add(name);
              return null;
            } else {
              local.deleted.delete(name);
            }

            return (
              <div
                key={idx}
                className={cx(
                  "flex items-stretch bg-white",
                  idx > 0 && "border-t",
                  css`
                    &:hover > .label {
                      color: blue;
                    }
                  `
                )}
                onContextMenu={(e) => {
                  contextMenu(e, arg.prop, [...arg.path, name], p);
                }}
              >
                {label && (
                  <div className="border-r flex items-center ml-1 pr-1 text-slate-400 label">
                    {label}
                  </div>
                )}
                <div className="flex flex-1">
                  {st.type === "string" && (
                    <SString
                      key={1}
                      structure={st}
                      value={curval as PLString}
                      prop={arg.prop}
                      path={[...arg.path, name]}
                      onChange={(e) => {
                        if (!cur[name]) {
                          cur[name] = { type: "string", value: e };
                        } else {
                          if (!e) {
                            cur[name] = { type: "string", value: "" };
                          } else {
                            cur[name] = { ...cur[name], value: e };
                          }
                        }
                        onChange(cur);
                      }}
                    />
                  )}

                  {st.type === "object" && (
                    <SObject
                      key={1}
                      structure={st}
                      prop={arg.prop}
                      path={[...arg.path, name]}
                      value={curval as PLObject}
                      onChange={(e) => {
                        if (cur[name] && cur[name].type === "code") {
                          if (
                            typeof e === "object" &&
                            typeof e?.value !== "undefined"
                          ) {
                            console.log(e);
                            cur[name] = e;
                          } else {
                            cur[name].value = e;
                          }
                        } else {
                          cur[name] = { type: "object", value: e };
                        }
                        onChange(cur);
                      }}
                    />
                  )}
                </div>
                {deletable && (
                  <div
                    className="text-red-600 w-[20px] justify-center flex items-center border-l cursor-pointer hover:outline-red-600 hover:bg-red-50"
                    onClick={() => {
                      delete cur[name];
                      local.deleted.add(name);
                      local.render();
                      onChange(cur);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <X size={12} />
                  </div>
                )}
                {!deleted_popup_rendered && local.deleted.size > 0 && (
                  <Popover
                    asChild
                    placement="bottom"
                    content={({ close }) => (
                      <div className="flex text-sm min-w-[200px] min-h-[100px] flex-col">
                        <div className="p-1 text-xs border-b bg-slate-100">
                          Add Properties:
                        </div>
                        {[...local.deleted].map((name) => {
                          return (
                            <div
                              key={name}
                              className="flex border-b p-1 cursor-pointer hover:bg-blue-500 hover:text-white"
                              onClick={() => {
                                const st = s.object[name];
                                if (st) {
                                  cur[name] = createListItem(st);
                                  local.deleted.delete(name);
                                  local.render();
                                  onChange(cur);
                                }
                                close();
                              }}
                            >
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  >
                    <div
                      className="w-[20px] justify-center border-l flex items-center cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </Popover>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <SCode
          onChange={(src) => {
            if (!src) {
              const s = getPropStructureByPath(
                arg.prop.structure,
                arg.prop.ctx_path
              );
              if (typeof s !== "undefined") {
                const blank_value = createListItem(s);
                if (typeof blank_value === "string") {
                  onChange({ type: "string", value: blank_value });
                } else {
                  onChange(blank_value);
                }
                return;
              }
            }
            onChange(src);
          }}
          path={arg.path}
          prop={arg.prop}
          value={value as any}
        />
      )}
    </div>
  );
};

const SCode: FC<{
  value: PLCode;
  path: (string | number)[];
  prop: PropListSingle;
  onChange: (val: any) => void;
}> = ({ value, onChange, prop, path }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    open: prop.ctx_path.join(".") === path.join("."),
    value: value?.value,
    refresh: false,
  });

  useEffect(() => {
    local.value = value.value;
    local.render();
  }, [value.value]);

  return (
    <div
      className="flex-1 flex items-center p-1"
      onPointerDown={(e) => {
        if (local.open === false) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      onContextMenu={(e) => {
        contextMenu(e, prop, path, p);
      }}
    >
      <FieldCode
        open={local.open}
        value={local.value}
        onOpenChange={(open) => {
          if (!open && local.value !== value.value) {
            onChange(local.value);
          }
          local.open = open;
          local.render();
        }}
        onChange={(val) => {
          local.value = val;
          local.render();
        }}
      />
    </div>
  );
};

const contextMenu = (
  e: React.MouseEvent,
  prop: PropListSingle,
  path: (string | number)[],
  p: PG
) => {
  e.stopPropagation();
  e.preventDefault();
  prop.ctx_path = path;

  if (!prop.ctx_menu) {
    prop.ctx_menu = e;
    p.render();
  } else {
    prop.ctx_menu = null;
    p.render();
  }
};
