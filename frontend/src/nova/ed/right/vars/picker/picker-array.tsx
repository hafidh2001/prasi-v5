import { FC } from "react";
import { EArrayType, EObjectEntry, EType, EVChildren } from "../lib/type";
import { EdTypePicker } from "./picker-type";

export const RenderArray: FC<{
  type: EArrayType;
  children: EVChildren;
  path: string[];
  className?: string;
  value: any;
  valuePath: string[];
  onChange: (path: string[], type: EType | EObjectEntry) => void;
  setValue: (path: string[], value: any) => void;
  markChanged: (path: string[]) => void;
}> = ({
  type,
  children,
  path,
  onChange,
  className,
  value,
  valuePath,
  markChanged,
}) => {
  if (value || path.length === 1) {
    return (
      <EdTypePicker
        type={type[0]}
        onChange={(path, type) => {
          onChange(path, type);
        }}
        path={[...path, "0"]}
        children={children}
        value={value ? value[0] : undefined}
        valuePath={[...valuePath, "0"]}
        markChanged={(p) => {
          markChanged(p);
        }}
      />
    );
  }

  return null;
};
