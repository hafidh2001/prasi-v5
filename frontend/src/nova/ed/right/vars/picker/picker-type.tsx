import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { EObjectEntry, EType, EVChildren } from "../lib/type";
import { getBaseType } from "../lib/validate";
import { definePickerPopup } from "./picker-popup";
import { definePickerRename, EdPickerRename } from "./picker-rename";

export const EdTypePicker: FC<{
  children: EVChildren;
  type: EType;
  onChange: (
    path: string[],
    type: EType | EObjectEntry,
    valuePath?: string[]
  ) => void;
  path: string[];
  valuePath?: string[];
  value: any;
  name?: string;
  markChanged?: (path: string[]) => void;
  changed?: number;
}> = ({
  children,
  type,
  onChange,
  path,
  name,
  value,
  markChanged,
  valuePath,
}) => {
  const local = useLocal({
    open: false,
    type: null as any,
    Item: null as any,
    item_len: 0,
    value,
    Rename: null as unknown as typeof EdPickerRename,
  });

  const base_type = getBaseType(type);

  if (type !== local.type) {
    local.type = type;
    local.item_len = -1;
    local.Item = definePickerPopup(local, base_type, (t) => {
      onChange(path, t, valuePath || path);
    });
  }

  return children({
    open: () => {
      console.log(local.open);
      local.open = true;
      local.render();
    },
    type,
    Item: local.Item,
    depth: path.length,
    name,
    path,
    value,
    children,
    valuePath: valuePath || path,
    markChanged(p) {
      if (markChanged) {
        markChanged(p);
      }
    },
  });
};
