import { FC } from "react";
import { EObjectEntry, EObjectType, EType, EVChildren } from "../lib/type";
import { getBaseType } from "../lib/validate";
import { RenderObject } from "./picker-object";
import { useLocal } from "utils/react/use-local";
const focus = { path: "" };

export const EdPickerLines: FC<{
  className: string;
  type: EType;
  children: EVChildren;
  onChange: (
    path: string[],
    type: EType | EObjectEntry,
    valuePath?: string[]
  ) => void;
  path: string[];
  valuePath: string[];
  value: any;
  markChanged?: (path: string[]) => void;
}> = ({
  className,
  type,
  children,
  onChange,
  path,
  valuePath,
  value,
  markChanged,
}) => {
  const local = useLocal({});
  const base_type = getBaseType(type);

  return (
    <div className={className}>
      {base_type === "object" && (
        <RenderObject
          children={children}
          onChange={onChange}
          path={path}
          className={className}
          type={type as EObjectType}
          onAdded={() => {
            focus.path = path.join(".");
            local.render();
          }}
          valuePath={valuePath}
          focus={path.join(".") === focus.path}
          onFocus={() => {
            focus.path = "";
            local.render();
          }}
          value={value}
          markChanged={(p) => {
            if (markChanged) {
              markChanged(p.slice(0, -1));
            }
          }}
        />
      )}
    </div>
  );
};
