import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { EObjectEntry, EType, EVChildren } from "../lib/type";
import { getBaseType } from "../lib/validate";
import { RenderObject } from "./picker-object";
import { definePickerPopup } from "./picker-popup";
import { definePickerRename, EdPickerRename } from "./picker-rename";
import { RenderArray } from "./picker-array";

const focus = { path: "" };

export const EdVarPicker: FC<{
  children: EVChildren;
  type: EType;
  onChange: (path: string[], type: EType | EObjectEntry) => void;
  path: string[];
  name?: string;
}> = ({ children, type, onChange, path, name }) => {
  const local = useLocal({
    open: false,
    type: null as any,
    Item: null as any,
    Lines: (arg: { className?: string }) => {
      return <></>;
    },
    item_len: 0,
    Rename: null as unknown as typeof EdPickerRename,
  });

  const base_type = getBaseType(type);
  if (
    type !== local.type ||
    (typeof type === "object" &&
      !!type &&
      local.item_len !== Object.keys(type).length)
  ) {
    local.type = type;
    local.item_len = -1;
    local.Item = definePickerPopup(local, base_type, (t) => {
      onChange(path, t);
    });

    local.Rename = definePickerRename({ path });

    if (base_type === "object") {
      local.item_len = Object.keys(type).length;

      local.Lines = ({ className }) => {
        return (
          <RenderObject
            children={children}
            onChange={onChange}
            path={path}
            className={className}
            type={local.type}
            onAdded={() => {
              focus.path = path.join(".");
              local.render();
            }}
            focus={path.join(".") === focus.path}
            onFocus={() => {
              focus.path = "";
              local.render();
            }}
          />
        );
      };
    } else if (base_type === "array") {
      local.Lines = ({ className }) => {
        return (
          <RenderArray
            children={children}
            onChange={onChange}
            path={path}
            className={className}
            type={local.type}
          />
        );
      };
    } else {
      local.Lines = () => {
        return <></>;
      };
    }
  }

  return children({
    open: () => {
      local.open = true;
      local.render();
    },
    type,
    Lines: local.Lines,
    Item: local.Item,
    depth: path.length,
    name,
    Rename: local.Rename,
    path,
  });
};
