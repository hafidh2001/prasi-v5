import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  ChevronDown,
  Scaling,
  Search,
  SquareCheck,
  SquareCheckBig,
} from "lucide-react";
import { extractRegion } from "popup/script/code/js/migrate-code";
import { codeUpdate } from "popup/script/code/prasi-code-update";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";
import { extractValue } from "./extract-value";
import { original } from "immer";
import { Resizable } from "re-resizable";

type MetaOption = {
  label: string;
  alt?: string;
  value: any;
  checked?: boolean;
  options?: MetaOption[];
  reload?: string[];
};

export const EdPropCheckbox = ({
  name,
  field,
  instance,
  options,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
  options: MetaOption[];
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    open: false,
    original_value: "",
    has_code: false,
    value: [] as MetaOption[],
    search: {
      text: "",
      focus: false,
    },
    size: undefined as undefined | { width: number; height: number },
  });

  useEffect(() => {
    const size = localStorage.getItem("ed-prop-checkbox-size");
    if (size) {
      try {
        local.size = JSON.parse(size);
      } catch (e) {}
    }

    if (!local.size)
      local.size = { width: 250, height: document.body.clientHeight - 100 };

    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      local.value = [];
      local.has_code = e.has_code;
      try {
        local.value = JSON.parse(e.value);
      } catch (e) {}
    }
    local.render();
    p.ui.comp.prop.render_prop_editor();
  }, [instance.props[name]?.value]);

  return (
    <div className="flex space-x-1 p-1">
      <Popover
        onOpenChange={(open) => {
          local.open = open;
          local.render();
        }}
        open={local.open}
        placement="left"
        content={
          <Resizable
            className={cx(
              "flex flex-col bg-white relative min-w-[250px]",
              css`
                max-height: ${document.body.clientHeight - 100}px;
              `
            )}
            minHeight={document.body.clientHeight - 100}
            defaultSize={local.size}
            onResizeStop={(_, __, div) => {
              local.size = {
                width: div.clientWidth,
                height: div.clientHeight,
              };
              localStorage.setItem(
                "ed-prop-checkbox-size",
                JSON.stringify(local.size)
              );
              local.render();
            }}
          >
            <div
              className={cx(
                "border-b flex items-stretch",
                local.search.focus && "bg-blue-50 outline-blue-500 outline-2"
              )}
            >
              <div className="flex items-center justify-center p-1">
                <Search size={14} />
              </div>
              <input
                type="search"
                autoFocus
                placeholder="Search..."
                className="flex p-1 outline-none bg-transparent flex-1"
                value={local.search.text}
                onChange={(e) => {
                  local.search.text = e.currentTarget.value;
                  local.render();
                }}
                onFocus={() => {
                  local.search.focus = true;
                  local.render();
                }}
                onBlur={() => {
                  local.search.focus = false;
                  local.render();
                }}
              />
              {/* {local.size && (
                <div
                  className="cursor-pointer flex items-center justify-center p-1"
                  onClick={() => {
                    localStorage.removeItem("ed-prop-checkbox-size");
                    local.size = undefined;
                    local.open = false;
                    local.render();
                  }}
                >
                  <Scaling size={14} />
                </div>
              )} */}
            </div>
            <div className="flex-1 overflow-y-auto relative">
              <div className="absolute inset-0">
                {Array.isArray(options) &&
                  options.map((item, idx) => {
                    const val: any[] = Array.isArray(local.value)
                      ? local.value
                      : [];
                    const found = val.find((e) => {
                      if (!item.options) {
                        return e === item.value;
                      } else {
                        if (typeof e === "object" && e.value === item.value) {
                          return true;
                        }
                        return false;
                      }
                    });
                    return (
                      <SingleCheckbox
                        item={item}
                        idx={idx}
                        val={val}
                        key={idx}
                        depth={0}
                        search={local.search.text.toLowerCase()}
                        onChange={(val) => {
                          local.value = val;
                          local.render();

                          const region = extractRegion(
                            instance.props[name].value || ""
                          );
                          let value = "";
                          if (region.length > 0) {
                            value = `${region.join("\n")}`;
                          }

                          value += `

export const ${name} = ${JSON.stringify(val, null, 2)};
`;
                          codeUpdate.push(p, active.item_id, value, {
                            prop_name: name,
                          });
                        }}
                        found={found}
                        render={local.render}
                      />
                    );
                  })}
              </div>
            </div>
          </Resizable>
        }
        asChild
      >
        <div
          className="flex flex-1 items-stretch bg-white border hover:border-blue-500 hover:bg-blue-50 rounded-sm select-none cursor-pointer "
          onClick={() => {
            local.open = true;
            local.render();
          }}
        >
          <div className="flex-1 flex items-center">
            <div className="px-1">
              {Array.isArray(local.value)
                ? local.value.length === 0
                  ? "Select Item"
                  : `${local.value.length} selected`
                : `Select Item`}
            </div>
          </div>
          <div className="pr-1 pt-[2px] flex items-center">
            <ChevronDown size={12} />
          </div>
        </div>
      </Popover>
    </div>
  );
};

const SingleCheckbox = ({
  val,
  item,
  idx,
  onChange,
  depth,
  found,
  render,
  search,
}: {
  item: MetaOption;
  idx: number;
  depth: number;
  val: any[];
  found: any;
  search: string;
  onChange: (val: MetaOption[], item: MetaOption) => void;
  render: () => void;
}) => {
  const is_check = !!val.find((e) => {
    if (!item.options) {
      return e === item.value;
    } else {
      if (typeof e === "object" && e.value === item.value) {
        return true;
      }
      return false;
    }
  });

  const toggleCheck = () => {
    if (item.options) {
      let idx = val.findIndex((e) => {
        if (typeof e === "object" && e.value === item.value) {
          return true;
        }
        return false;
      });

      if (idx >= 0) {
        val.splice(idx, 1);
      } else {
        val.push({ value: item.value, checked: [] });
      }
    } else {
      if (item.value) {
        let idx = val.findIndex((e) => e === item.value);

        if (idx >= 0) {
          val.splice(idx, 1);
        } else {
          val.push(item.value);
        }
      }
    }
    onChange(val, item);
  };

  useEffect(() => {
    if (item.checked && !is_check) {
      toggleCheck();
    }
  }, []);

  if (search && !item.label.toLowerCase().includes(search)) {
    return null;
  }

  return (
    <>
      <div
        className={cx(
          "flex pl-1 text-xs cursor-pointer select-none space-x-1 items-center",
          idx === 0 && !depth ? "" : "border-t",
          item.checked && "opacity-50",
          depth &&
            css`
              padding-left: ${depth * 20}px;
            `,
          is_check
            ? css`
                color: green;
                border-left: 3px solid green;

                &:hover {
                  border-left: 3px solid #a8d4a8;
                }

                svg {
                  width: 14px;
                }
              `
            : css`
                border-left: 3px solid transparent;

                svg {
                  color: gray;
                  width: 14px;
                }
                &:hover {
                  border-left: 3px solid #0084ff;
                  color: #0084ff;

                  svg {
                    color: #0084ff;
                  }
                }
              `
        )}
        onClick={() => {
          toggleCheck();
        }}
      >
        {!is_check ? unchecked : checked}
        <div className="flex-1">
          {item.label.length > 15 ? (
            <Tooltip content={item.label}>
              {item.label.substring(0, 15) + "..."}
            </Tooltip>
          ) : (
            item.label
          )}
        </div>
        <div
          className={cx(css`
            padding-left: 10px;
            padding-right: 20px;
            color: #aaa;
          `)}
        >
          {item.alt}
        </div>
      </div>

      {!!(item.options && (found || search)) &&
        item.options.map((child, idx) => {
          const sub_found = found.checked.find((e: any) => {
            if (!item.options) {
              return e === child.value;
            } else {
              if (typeof e === "object" && e.value === child.value) {
                return true;
              }
              return false;
            }
          });

          return (
            <SingleCheckbox
              key={idx}
              item={child}
              idx={idx}
              depth={depth + 1}
              val={found.checked}
              found={sub_found}
              search={search}
              onChange={(newval) => {
                onChange(val, child);
                render();
              }}
              render={render}
            />
          );
        })}
    </>
  );
};

const checked = <SquareCheckBig />;

const unchecked = <SquareCheck />;
