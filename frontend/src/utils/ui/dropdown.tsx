import { FC, ReactNode, useEffect, useRef } from "react";
import { Virtuoso as List, VirtuosoHandle } from "react-virtuoso";
import { useLocal } from "../react/use-local";
import { Popover } from "./popover";
import { Sticker } from "lucide-react";

type DropdownItem = { label: string; value: string } | string;

type DropdownExtProp = {
  value?: string;
  items?: DropdownItem[];
  popover?: {
    className?: string;
    itemClassName?: string;
    renderItem?: (val: DropdownItem, idx: number) => ReactNode;
  };
  onChange?: (value: string, idx: number, item: DropdownItem) => void;
  placeholder?: string;
};

export const Dropdown: FC<
  Omit<React.HTMLAttributes<HTMLInputElement>, keyof DropdownExtProp> &
    DropdownExtProp
> = (prop) => {
  const local = useLocal({
    open: false,
    search: "",
    searching: false,
    status: "init" as "init" | "ready",
    itemsCache: prop.items,
    activeIdx: -1,
    listEl: null as null | VirtuosoHandle,
    listElTimeout: null as any,
    scrolled: false,
    label: "",
  });
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!local.open) {
      local.scrolled = false;
      local.render();
    }
  }, [local.open]);

  useEffect(() => {
    local.searching = false;
    resetInputValue();
    local.render();
  }, [prop.value]);

  const resetInputValue = () => {
    if (prop.items) {
      const val = prop.value || "";
      let idx = 0;
      let found = false;
      for (const item of prop.items) {
        if (typeof item === "string" && item === val) {
          local.label = item;
          local.activeIdx = idx;
          found = true;
        } else if (typeof item === "object" && item.value === val) {
          local.label = item.label;
          local.activeIdx = idx;
          found = true;
        }
        idx++;
      }
      if (!found) {
        local.label = "";
        local.activeIdx = -1;
        local.render();
      }
    }
  };

  if (local.status === "init" || prop.items !== local.itemsCache) {
    local.status = "ready";
    local.itemsCache = prop.items;
    resetInputValue();
  }

  const elProp: any = { ...prop };
  delete elProp["value"];
  delete elProp["items"];
  delete elProp["onChange"];
  delete elProp["popover"];

  let items = prop.items || [];

  const search = local.search.toLowerCase().replace(/\W/, "");
  if (search) {
    items = [];
    for (const item of prop.items || []) {
      if (
        typeof item === "string" &&
        item.toLowerCase().replace(/\W/, "").includes(search)
      ) {
        items.push(item);
      } else if (
        typeof item === "object" &&
        (item.label.toLowerCase().replace(/\W/, "").includes(search) ||
          item.value.toLowerCase().replace(/\W/, "").includes(search))
      ) {
        items.push(item);
      }
    }
  }

  if (local.activeIdx > items.length - 1) {
    local.activeIdx = 0;
  }

  return (
    <Popover
      open={local.open}
      onOpenChange={(open) => {
        setTimeout(() => {
          if (document.activeElement === ref.current && !open) {
            return;
          }
          local.open = open;
          local.searching = false;
          local.search = "";
          resetInputValue();
          local.render();
        }, 50);
      }}
      autoFocus={false}
      placement="bottom-start"
      backdrop={false}
      arrow={false}
      offset={0}
      popoverClassName={cx("bg-white border", prop.popover?.className)}
      content={
        <>
          {items.length > 0 ? (
            <List
              className={cx(
                `${
                  items.length > 3
                    ? "min-h-[140px] max-h-[350px]"
                    : items.length === 3
                      ? "min-h-[85px]"
                      : items.length === 1
                        ? "min-h-[30px]"
                        : "min-h-[57px]"
                } min-w-[200px] flex-1 w-full`,
                css`
                  .active {
                    background-color: #3c82f6;
                    color: white;
                  }
                `
              )}
              data={items}
              ref={(el) => {
                if (el && !local.scrolled) {
                  clearTimeout(local.listElTimeout);
                  local.listElTimeout = setTimeout(() => {
                    local.scrolled = true;
                    local.listEl = el;
                    el.scrollToIndex(local.activeIdx - 2);
                  }, 50);
                }
              }}
              itemContent={(idx, e) => {
                return (
                  <div
                    key={typeof e === "string" ? e : e.value}
                    className={cx(
                      "cursor-pointer px-1 flex items-center leading-3 h-[28px]",
                      idx > 0 && "border-t",
                      idx === local.activeIdx && "active",
                      prop.popover?.itemClassName
                        ? prop.popover?.itemClassName
                        : "hover:bg-blue-100 px-2 whitespace-nowrap select-none"
                    )}
                    onClick={() => {
                      local.open = false;
                      local.status === "init";
                      local.search = "";
                      local.searching = false;
                      if (prop.onChange) {
                        prop.onChange(
                          typeof e === "string" ? e : e.value,
                          idx,
                          e
                        );
                      }
                      local.render();
                    }}
                  >
                    {prop.popover?.renderItem
                      ? prop.popover.renderItem(e, idx)
                      : typeof e === "string"
                        ? e
                        : e.label}
                  </div>
                );
              }}
            ></List>
          ) : (
            <div className="flex flex-col items-center min-h-[100px] min-w-[250px] justify-center flex-1 h-full text-gray-500">
              <Sticker size={40} strokeWidth={1} />
              List Empty
            </div>
          )}
        </>
      }
      {...elProp}
      className={cx(
        "dropdown bg-white relative flex items-stretch",
        elProp.className
      )}
    >
      <>
        <div className="pointer-events-none absolute right-0 bottom-0 top-0 bg-white flex items-center justify-center w-[20px] ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M3.135 6.158a.5.5 0 01.707-.023L7.5 9.565l3.658-3.43a.5.5 0 01.684.73l-4 3.75a.5.5 0 01-.684 0l-4-3.75a.5.5 0 01-.023-.707z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          className={cx("pl-1 cursor-pointer outline-none input flex-1")}
          type="string"
          placeholder={elProp.placeholder}
          spellCheck={false}
          value={local.searching ? local.search : local.label}
          onChange={(e) => {
            local.searching = true;
            local.search = e.currentTarget.value;
            local.open = true;

            local.render();
          }}
          autoFocus={elProp.autoFocus}
          onKeyDown={(e) => {
            if (!local.open) {
              local.open = true;
              local.render();
              return;
            }
            if (e.key === "Enter") {
              local.searching = false;
              local.open = false;
              const current = items[local.activeIdx];
              if (current) {
                if (prop.onChange) {
                  const val =
                    typeof current === "string" ? current : current.value;
                  const idx = prop.items?.findIndex((e) => e === current);
                  if (typeof idx === "number") {
                    prop.onChange(val, idx, current);
                  }
                }
              }
              local.render();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              if (local.activeIdx >= items.length - 1) {
                local.activeIdx = 0;
              } else {
                local.activeIdx++;
              }
              local.render();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (local.activeIdx === 0) {
                local.activeIdx = items.length - 1;
              } else {
                local.activeIdx--;
              }
              local.render();
            }
          }}
          ref={ref}
          onFocus={(e) => {
            e.currentTarget.select();
            if (!local.open) {
              local.open = true;
              local.render();
            }
          }}
        />
      </>
    </Popover>
  );
};
