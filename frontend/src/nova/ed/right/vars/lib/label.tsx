import {
  Box,
  Braces,
  Brackets,
  CircleOff,
  Columns3,
  LayoutList,
  TableProperties,
  ToggleLeft,
} from "lucide-react";
import { Tooltip } from "utils/ui/tooltip";
import { EType } from "./type";

export const EdTypeLabel = ({ type: _type }: { type: EType }) => {
  let type = typeof _type === "string" ? _type : "unknown";

  if (type === "unknown" && typeof _type === "object") {
    if (Array.isArray(_type)) type = "array";
    else type = "object";
  }

  return (
    <Tooltip
      content={<div className="capitalize">{type}</div>}
      delay={0}
      className={cx(
        "flex text-xs items-center",
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
            margin-left: 5px;
          }
        `
      )}
    >
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
    </Tooltip>
  );
};
