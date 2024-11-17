import get from "lodash.get";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  PlusCircle,
  Trash,
} from "lucide-react";
import { FC, Fragment, useEffect } from "react";
import { arrayMove, List } from "react-movable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Dropdown } from "utils/ui/dropdown";
import { FieldCode } from "../../../../tree/master-prop/ed-mp-fields";
import { extractValue } from "./extract-value";
import {
  createListItem,
  ListStructure,
  LSObject,
  LSString,
  parsePLValue,
  PLCode,
  PLObject,
  PLString,
  plStringify,
  PLValue,
} from "./prop-list/prop-list-util";

type PROP_NAME = string;

const prop_list = {} as Record<
  PROP_NAME,
  {
    structure: ListStructure;
    value: PLValue[];
    expand: boolean;
    update_timeout: any;
  }
>;

export const EdPropListHead = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});
  const { name } = arg;

  useEffect(() => {
    for (const k of Object.keys(prop_list)) {
      delete prop_list[k];
    }
    local.render();
  }, [active.item_id]);

  useEffect(() => {
    delete prop_list[name];
    local.render();
  }, [arg.instance.props[name].value]);

  if (!prop_list[name]) {
    const structure = new Function(
      `return ${arg.field.meta?.optionsBuilt || ""}`
    );

    let prop = arg.instance.props[name];
    const extracted = extractValue(p, name, prop);
    if (extracted) {
      prop_list[name] = {
        expand: true,
        structure: structure(),
        value: parsePLValue(extracted.value),
        update_timeout: null as any,
      };
    }
  }

  const prop = prop_list[name];
  if (!prop) return null;

  return (
    <div
      className={cx(
        "flex items-center justify-between border-l px-1 flex-1 hover:bg-blue-50 hover:text-black"
      )}
      onClick={() => {
        prop.expand = prop.expand === undefined ? false : !prop.expand;
        p.render();
      }}
    >
      <div
        className={cx(
          "text-[10px] bg-white ml-1 px-1 rounded-sm flex items-center transition-all ",
          !prop.expand && "border"
        )}
      >
        {(prop.expand || typeof prop.expand === "undefined") && (
          <>
            Hide <ChevronDown size={10} className="ml-1" />
          </>
        )}

        {prop.expand === false && (
          <>
            Show
            <ChevronRight size={10} className="ml-1" />
          </>
        )}
      </div>
      <div
        className="border pl-[3px] pr-[6px] flex items-center space-x-1 hover:bg-blue-600 hover:text-white rounded-sm text-xs bg-white"
        onClick={(e) => {
          e.stopPropagation();
          const item = createListItem(prop.structure);
          prop.value.push(item as any);
          const source = `[${prop.value.map((e) => plStringify(e)).join(",")}]`;

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
  );
};

export const EdPropList = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});

  const name = arg.name;
  const prop = prop_list[name];
  if (!prop || (prop && !prop.expand)) return null;

  const update = () => {
    local.render();
    clearInterval(prop.update_timeout);
    prop.update_timeout = setTimeout(() => {
      const source = `[${prop.value.map((e) => plStringify(e)).join(",")}]`;
      getActiveTree(p).update("Update Prop List", ({ findNode }) => {
        const n = findNode(active.item_id);
        if (n && n.item.component) {
          n.item.component.props[name].value = source;
          n.item.component.props[name].valueBuilt =
            n.item.component.props[name].value;
        }
      });
    }, 500);
  };

  return (
    <div className={cx("flex items-stretch flex-col flex-1 bg-white")}>
      <List
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
              "relative text-sm flex items-stretch",
              css`
                &:hover > .grip {
                  background: #3c82f6;
                  color: white;
                }
              `
            )}
          >
            <Fragment key={1}>
              <div className="grip w-[15px] cursor-ns-resize flex items-center justify-center border-r">
                <GripVertical size={10} />
              </div>
              <div
                className="flex-1"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {prop.structure.type === "string" && (
                  <SString
                    structure={prop.structure}
                    value={item as PLString}
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
                    onChange={(e) => {
                      if (typeof index === "number") {
                        prop.value[index] = { type: "object", value: e };
                        prop.value = [...prop.value];
                        update();
                      }
                    }}
                  />
                )}
              </div>
              <div
                className="cursor-pointer flex items-center justify-center border-l w-[18px] hover:text-red-600"
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
  onChange: (val: string) => void;
}> = (arg) => {
  const { structure: s, value, onChange } = arg;
  const local = useLocal({ value: value?.value || "", focus: false });

  useEffect(() => {
    if (!local.focus && typeof value === "object" && value?.value) {
      local.value = value.value;
      local.render();
    }
  }, [value]);

  return (
    <div className="flex-1 flex">
      {value.type !== "code" ? (
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
              className="flex-1 outline-none rounded-none px-1 py-[2px]"
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
        <SCode onChange={onChange} value={value as any} />
      )}
    </div>
  );
};

const SObject: FC<{
  structure: LSObject;
  value: PLValue;
  onChange: (val: any) => void;
}> = (arg) => {
  const { structure: s, value, onChange } = arg;
  let cur = value as any;
  if (typeof value !== "object") {
    cur = {};
  } else if (cur.value) {
    cur = cur.value;
  }

  return (
    <div
      className="flex-1 flex flex-col"
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {Object.entries(s.object).map(([name, st], idx) => {
        const curval = get(cur, name);
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
          >
            <div className="border-r flex items-center ml-1 pr-1 text-slate-400 label">
              {name}
            </div>
            <div className="flex flex-1">
              {value.type !== "code" ? (
                <>
                  {st.type === "string" && (
                    <SString
                      key={1}
                      structure={st}
                      value={curval as PLString}
                      onChange={(e) => {
                        if (!cur[name]) {
                          cur[name] = { type: "string", value: e };
                        } else {
                          cur[name] = { ...cur[name], value: e };
                        }
                        onChange(cur);
                      }}
                    />
                  )}

                  {st.type === "object" && (
                    <SObject
                      key={1}
                      structure={st}
                      value={curval as PLObject}
                      onChange={(e) => {
                        cur[name] = { type: "object", value: e };
                        onChange(cur);
                      }}
                    />
                  )}
                </>
              ) : (
                <SCode
                  onChange={(value) => {
                    cur[name] = { type: "code", value };
                    onChange(cur);
                  }}
                  value={value as any}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SCode: FC<{
  value: PLCode;
  onChange: (val: any) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({ open: false, value: value?.value });
  return (
    <div
      className="flex-1 flex items-center p-1"
      onPointerDown={(e) => {
        if (local.open === false) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <FieldCode
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
