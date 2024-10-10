import React, { forwardRef } from "react";
import { CircleOff, Columns3, LayoutList, ToggleLeft } from "lucide-react";
import { Tooltip } from "utils/ui/tooltip";
import { EType } from "./type";

export const EdTypeLabel = forwardRef<
  HTMLDivElement,
  {
    type: EType;
    show_label?: boolean;
  }
>(({ type: _type, show_label }, ref) => {
  let type = typeof _type === "string" ? _type : "unknown";

  if (type === "unknown" && typeof _type === "object") {
    if (Array.isArray(_type)) type = "array";
    else type = "object";
  }

  const class_name = cx(
    "flex text-sm items-center",
    css`
      .icon {
        border-radius: 2px;
        font-size: 10px;
        width: 24px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre;
      }
      svg {
        width: 13px;
        height: 13px;
      }
      .text {
        text-transform: capi;
      }
    `
  );

  const content = (
    <div ref={ref} className={class_name}>
      {type === "string" && (
        <>
          <div className="icon">STR</div>
        </>
      )}
      {type === "boolean" && (
        <>
          <div className="icon">
            <ToggleLeft />
          </div>
        </>
      )}
      {type === "number" && (
        <>
          <div className="icon">123</div>
        </>
      )}
      {type === "null" && (
        <>
          <div className="icon">
            <CircleOff />
          </div>
        </>
      )}
      {type === "object" && (
        <>
          <div className="icon">
            <LayoutList />
          </div>
        </>
      )}
      {type === "array" && (
        <>
          <div className="icon">
            <Columns3 />
          </div>
        </>
      )}
      {show_label && <div className="text capitalize">{type}</div>}
    </div>
  );

  if (show_label) return content;

  return (
    <Tooltip
      content={<div className="capitalize">{type}</div>}
      delay={0}
      className={class_name}
      asChild
    >
      {content}
    </Tooltip>
  );
});
