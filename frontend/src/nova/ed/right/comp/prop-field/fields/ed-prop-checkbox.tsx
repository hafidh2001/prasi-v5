import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Popover } from "utils/ui/popover";
import { Tooltip } from "utils/ui/tooltip";

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
  value,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
  options: MetaOption[];
  value: string;
}) => {
  const local = useLocal({
    open: false,
  });
  return (
    <div className="flex space-x-1 p-1">
      <Popover
        onOpenChange={(open) => {
          local.open = open;
          local.render();

          // if (!open) {
          //   onChange(JSON.stringify(local.pendingVal), null as any);
          // } else {
          //   local.pendingVal = null;
          //   local.render();
          // }
        }}
        open={local.open}
        content={
          <div
            className={cx(
              "flex flex-col min-w-[200px] bg-white overflow-auto",
              css`
                max-height: ${document.body.clientHeight - 100}px;
              `
            )}
          >
            {Array.isArray(options) &&
              options.map((item, idx) => {
                const val: any[] = Array.isArray(value) ? value : [];
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
                    onChange={(val) => {
                      // onChange(JSON.stringify(val), item);
                      local.render();
                    }}
                    found={found}
                    render={local.render}
                  />
                );
              })}
          </div>
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
              {Array.isArray(value)
                ? value.length === 0
                  ? "Select Item"
                  : `${value.length} selected`
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
}: {
  item: MetaOption;
  idx: number;
  depth: number;
  val: any[];
  found: any;
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

      {item.options &&
        found &&
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

const checked = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-square-check-big"
    viewBox="0 0 24 24"
  >
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
  </svg>
);
const unchecked = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-square"
    viewBox="0 0 24 24"
  >
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
  </svg>
);
