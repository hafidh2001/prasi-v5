import { FC } from "react";
import {
  EArrayType,
  EObjectEntry,
  EObjectType,
  EType,
  EVChildren,
} from "../lib/type";
import { getBaseType } from "../lib/validate";
import { RenderObject } from "./picker-object";
import { useLocal } from "utils/react/use-local";
import { RenderArray } from "./picker-array";
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
  setValue: (path: string[], value: any) => void;
}> = ({
  className,
  type,
  children,
  onChange,
  path,
  valuePath,
  value,
  markChanged,
  setValue,
}) => {
  const local = useLocal({});
  const base_type = getBaseType(type);

  return (
    <>
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
          setValue={setValue}
          markChanged={(p) => {
            if (markChanged) {
              markChanged(p.slice(0, -1));
            }
          }}
        />
      )}
      {base_type === "array" && (
        <RenderArray
          children={children}
          onChange={onChange}
          path={path}
          className={className}
          type={type as EArrayType}
          valuePath={valuePath}
          setValue={setValue}
          value={value}
          markChanged={(p) => {
            if (markChanged) {
              markChanged(p.slice(0, -1));
            }
          }}
        />
      )}
    </>
  );
};
