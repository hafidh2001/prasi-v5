import { EDGlobal, PG } from "logic/ed-global";
import React, { FC, ReactElement, useCallback, useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";

export const num_drag = {
  disable_highlight: (p: PG) => {},
};

export const FieldNumUnit: FC<{
  label?: string;
  icon?: ReactElement;
  value: string;
  unit?: string;
  hideUnit?: boolean;
  update: (value: string, setDragVal?: (val: number) => void) => void;
  width?: string;
  positiveOnly?: boolean;
  disabled?: boolean | string;
  enableWhenDrag?: boolean;
  dashIfEmpty?: boolean;
  className?: string;
}> = ({
  icon,
  value,
  label,
  update: _update,
  unit,
  hideUnit,
  width,
  disabled,
  positiveOnly,
  enableWhenDrag,
  className,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    val: 0,
    val_str: "",
    focus: false,
    unit: "",
    drag: { clientX: 0, old: 0, clientY: 0 },
    dragging: false,
    timeout: null as any,
    direction: "h" as "h" | "v",
  });

  const update: typeof _update = useCallback(
    (...arg) => {
      clearTimeout(local.timeout);
      local.timeout = setTimeout(() => {
        _update(...arg);
      }, 100);
    },
    [_update]
  );

  const parseVal = useCallback(() => {
    let val = "";
    let unt = "";
    if (value.length >= 1) {
      let fillMode = "val" as "val" | "unit";
      for (let idx = 0; idx < value.length; idx++) {
        const c = value[idx];
        if (idx > 0 && isNaN(parseInt(c))) {
          fillMode = "unit";
        }

        if (fillMode === "val") {
          val += c;
        } else {
          unt += c || "";
        }
      }
      if (!parseInt(val)) unt = "";
    }
    local.val = parseInt(val) || 0;
    if (positiveOnly && local.val < 0) {
      local.val = Math.max(0, local.val);
    }
    local.unit = unit || unt || "px";

    if (!local.focus) {
      local.val_str = local.val + "";
    }
    local.render();
  }, [value, unit]);

  useEffect(() => {
    parseVal();
    local.render();
  }, [value, unit]);

  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: any) => {
      if (local.drag.clientX || local.drag.clientY) {
        num_drag.disable_highlight(p);

        if (
          local.direction === "v" &&
          local.drag.clientX !== event.clientX &&
          Math.abs(local.drag.clientX - event.clientX) > 5
        )
          local.direction = "h";
        if (
          local.direction === "h" &&
          local.drag.clientY !== event.clientY &&
          Math.abs(local.drag.clientY - event.clientY) > 5
        )
          local.direction = "v";

        local.val =
          local.direction === "h"
            ? Math.round(local.drag.old + (event.clientX - local.drag.clientX))
            : Math.round(local.drag.old + (event.clientY - local.drag.clientY));

        if (positiveOnly && local.val < 0) {
          local.val = Math.max(0, local.val);
        }

        local.val_str = local.val + "";
        local.render();

        update(local.val + local.unit);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      local.drag.clientX = 0;
      local.drag.clientY = 0;
      local.dragging = false;
      local.render();
    };

    document.addEventListener("pointermove", onUpdate);
    document.addEventListener("pointerup", onEnd);
    return () => {
      document.removeEventListener("pointermove", onUpdate);
      document.removeEventListener("pointerup", onEnd);
    };
  }, [
    local.drag.clientX,
    local.drag.old,
    local.drag.clientY,
    local.val,
    update,
  ]);

  const onStart = useCallback(
    (event: React.MouseEvent) => {
      let _disabled = disabled;
      if (enableWhenDrag && _disabled) {
        update(local.val + local.unit, (val) => {
          local.val = val;
        });
        _disabled = false;
      }
      if (!_disabled) {
        local.dragging = true;
        local.render();

        local.drag.clientX = event.clientX;
        local.drag.clientY = event.clientY;
        local.drag.old = local.val;
      }
    },
    [local.val, disabled]
  );

  return (
    <>
      <div
        className={cx(
          "field-num flex flex-row items-stretch justify-between bg-white border border-transparent btn-hover h-full",
          className,
          parseInt(local.val_str) &&
            css`
              border-color: blue !important;
            `
        )}
      >
        <div className="icon flex cursor-ew-resize" onPointerDown={onStart}>
          {icon && (
            <div
              className="flex items-center justify-center opacity-50 ml-1"
              onPointerDown={onStart}
            >
              {icon}
            </div>
          )}
          {label && (
            <div className="flex items-center justify-center text-[11px] opacity-50 w-[14px] ml-1">
              {label}
            </div>
          )}
        </div>
        <div className="flex justify-between flex-1 items-center flex-grow overflow-hidden">
          <input
            type="text"
            className={cx(
              css`
                width: ${width ? width : "23px"};
                background: transparent;
                outline: none;
                font-size: 11px;
              `,
              !!disabled && "text-center text-gray-400",
              enableWhenDrag &&
                css`
                  cursor: text !important;
                `,
              enableWhenDrag &&
                local.focus &&
                css`
                  cursor: black !important;
                `
            )}
            disabled={
              enableWhenDrag ? (local.focus ? false : !!disabled) : !!disabled
            }
            onPointerDown={(e) => {
              if (enableWhenDrag) {
                local.focus = true;
                local.render();
              }
            }}
            value={
              typeof disabled === "string"
                ? enableWhenDrag && local.focus
                  ? local.val_str
                  : disabled
                : local.val_str
            }
            onFocus={(e) => {
              e.currentTarget.select();
              local.focus = true;
              local.render();
            }}
            onBlur={() => {
              local.focus = false;
              local.val_str = local.val + "";
              local.render();
            }}
            onChange={(e) => {
              local.val_str = e.currentTarget.value;
              local.val = parseInt(local.val_str) || 0;
              local.render();
              update(local.val + local.unit);
            }}
          />
          {hideUnit !== true && (
            <div
              className="text-[11px] mx-1 flex cursor-ew-resize"
              onPointerDown={onStart}
            >
              {local.unit}
            </div>
          )}
        </div>
      </div>
      {local.dragging && (
        <div
          className={cx(
            "fixed z-50 inset-0",
            local.direction === "v" ? "cursor-ns-resize" : "cursor-ew-resize"
          )}
        ></div>
      )}
    </>
  );
};
