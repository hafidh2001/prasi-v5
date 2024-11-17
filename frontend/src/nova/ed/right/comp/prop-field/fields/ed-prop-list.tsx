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
import { EdPropCode } from "./ed-prop-code";
import { extractValue } from "./extract-value";
import get from "lodash.get";
import { Dropdown } from "utils/ui/dropdown";

type LSString = {
  type: "string";
  placeholder?: string;
  options?: ({ label: string; value: string } | string)[];
};
type LSObject = { type: "object"; object: Record<string, ListStructure> };
type ListStructure = LSString | LSObject;

const expand = {} as Record<string, boolean>;
export const EdPropListHead = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    value: [] as any[],
    has_code: false,
    original_value: "",
  });
  const { name, instance } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      if (e.value.startsWith("[")) {
        const fn = new Function(`return ${e.value}`);
        local.value = fn();
      }
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  return (
    <div
      className={cx(
        "flex items-center justify-between border-l px-1 flex-1 hover:bg-blue-50"
      )}
      onClick={() => {
        expand[name] = expand[name] === undefined ? false : !expand[name];
        p.render();
      }}
    >
      <div className="text-[10px] bg-white ml-1 px-1 rounded-sm flex items-center">
        {(expand[name] || typeof expand[name] === "undefined") && (
          <>
            Hide <ChevronDown size={10} className="ml-1" />
          </>
        )}

        {expand[name] === false && (
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
          const fn = new Function(
            `return ${arg.field.meta?.optionsBuilt || ""}`
          );
          const item = createListItem(fn());

          getActiveTree(p).update(
            `${"Add Item to Prop "} ${name}`,
            ({ findNode }) => {
              const n = findNode(active.item_id);

              if (n && n.item.component?.props) {
                local.value.push(item);
                n.item.component.props[name].value = JSON.stringify(
                  local.value
                );
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

const createListItem = (structures: ListStructure) => {
  if (structures.type === "string") {
    return "";
  } else if (structures.type === "object") {
    const item = {};
    return item;
  }
};

export const EdPropList = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    value: [] as any[],
    structure: null as ListStructure | null,
    has_code: false,
    original_value: "",
    timeout: null as any,
  });
  const { name, instance } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      if (e.value.startsWith("[")) {
        const fn = new Function(`return ${e.value}`);
        local.value = fn();
      }

      const fn = new Function(`return ${arg.field.meta?.optionsBuilt || ""}`);
      local.structure = fn();
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  const update = () => {
    clearInterval(local.timeout);
    local.timeout = setTimeout(() => {
      getActiveTree(p).update("Update Prop List", ({ findNode }) => {
        const n = findNode(active.item_id);
        if (n && n.item.component) {
          n.item.component.props[name].value = JSON.stringify(local.value);
          n.item.component.props[name].valueBuilt =
            n.item.component.props[name].value;
        }
      });
    }, 500);
  };

  const s = local.structure;
  if (!s || expand[name] === false) return null;
  return (
    <div className={cx("flex items-stretch flex-col flex-1 bg-white")}>
      <List
        lockVertically
        onChange={({ oldIndex, newIndex }) => {
          local.value = arrayMove(local.value, oldIndex, newIndex);
          local.render();
          update();
        }}
        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
        values={local.value}
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
                {s.type === "string" && (
                  <SString
                    structure={s}
                    value={item}
                    onChange={(e) => {
                      if (typeof index === "number") {
                        local.value[index] = e;
                        local.value = [...local.value];
                        local.render();
                        update();
                      }
                    }}
                  />
                )}

                {s.type === "object" && (
                  <SObject
                    structure={s}
                    value={item}
                    onChange={(e) => {
                      if (typeof index === "number") {
                        local.value[index] = e;
                        local.value = [...local.value];
                        local.render();
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
                    local.value.splice(index, 1);
                    local.render();
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
  value: string;
  onChange: (val: string) => void;
}> = ({ structure: s, value, onChange }) => {
  const local = useLocal({ value, focus: false });

  useEffect(() => {
    if (!local.focus) {
      local.value = value;
      local.render();
    }
  }, [value]);

  return (
    <div className="flex-1 flex">
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
    </div>
  );
};

const SObject: FC<{
  structure: LSObject;
  value: any;
  onChange: (val: any) => void;
}> = ({ structure: s, value, onChange }) => {
  let cur = value;
  if (typeof value !== "object") {
    cur = {};
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
              {st.type === "string" && (
                <SString
                  key={1}
                  structure={st}
                  value={curval}
                  onChange={(e) => {
                    cur[name] = e;
                    onChange(cur);
                  }}
                />
              )}

              {st.type === "object" && (
                <SObject
                  key={1}
                  structure={st}
                  value={curval}
                  onChange={(e) => {
                    cur[name] = e;
                    onChange(cur);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
