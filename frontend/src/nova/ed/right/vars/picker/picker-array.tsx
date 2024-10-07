import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import {
  EArrayType,
  EObjectEntry,
  EObjectType,
  EType,
  EVChildren,
} from "../lib/type";
import { EdVarPicker } from "./picker";

export const RenderArray: FC<{
  type: EArrayType;
  children: EVChildren;
  path: string[];
  className?: string;
  onChange: (path: string[], type: EType | EObjectEntry) => void;
}> = ({ type, children, path, onChange, className }) => {
  console.log(type, path);
  return (
    <div
      className={cx("flex flex-col")}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <EdVarPicker
        type={type[0]}
        onChange={(path, type) => {
          onChange(path, type);
        }}
        path={[...path, "0"]}
        children={children}
      />
    </div>
  );
};
