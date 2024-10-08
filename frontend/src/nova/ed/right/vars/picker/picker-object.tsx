import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { EObjectEntry, EObjectType, EType, EVChildren } from "../lib/type";
import { EdVarPicker } from "./picker";
import { Tooltip } from "utils/ui/tooltip";

export const RenderObject: FC<{
  type: EObjectType;
  children: EVChildren;
  path: string[];
  className?: string;
  onChange: (path: string[], type: EType | EObjectEntry) => void;
  focus: boolean;
  onAdded: () => void;
  onFocus: () => void;
  value: any;
  valuePath: string[];
  markChanged: (path: string[]) => void;
}> = ({
  type,
  children,
  path,
  onChange,
  className,
  focus,
  onAdded,
  onFocus,
  value,
  markChanged,
  valuePath,
}) => {
  const local = useLocal({ new_property: { text: "" }, ts: Date.now() });
  const addNew = () => {
    let final_path = [...path, local.new_property.text];
    if (path.length === 2 && path[1] !== "0") {
      final_path = [...path, "type", local.new_property.text];
    }

    const now = Date.now();

    onChange(final_path, {
      type: "string",
      idx: now,
      optional: false,
    });
    local.new_property.text = "";
    local.render();
    setTimeout(() => {
      onAdded();
    });
  };
  return (
    <div
      className={cx("flex flex-col")}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {Object.entries(type)
        .filter(([_, value]) => {
          return !!value;
        })
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, val]) => (
          <EdVarPicker
            key={key}
            type={val.type}
            onChange={(path, type) => {
              onChange(path, type);
            }}
            path={[...path, key, "type"]}
            valuePath={[...valuePath, key]}
            children={children}
            name={key}
            value={typeof value === "object" && value ? value[key] : undefined}
            markChanged={(p) => {
              markChanged(p);
            }}
            changed={local.ts}
          />
        ))}
      <Tooltip
        content={
          <>
            Press{" "}
            <b className="font-bold font-mono text-[9px] mx-[2px]">[ENTER]</b>{" "}
            to add property
          </>
        }
        asChild
        placement="left"
        open={!!local.new_property.text}
      >
        <div className={cx("flex items-center border-b", className)}>
          <PlusCircle size={12} className="mr-1 text-slate-400 ml-3" />

          <input
            type="text"
            placeholder="Add Property"
            className="outline-none flex-1 p-1"
            spellCheck={false}
            value={local.new_property.text}
            onChange={(e) => {
              local.new_property.text = e.target.value.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              );
              local.render();
            }}
            ref={(ref) => {
              if (focus) {
                ref?.focus();
              }
            }}
            onFocus={() => {
              onFocus();
            }}
            onBlur={() => {
              if (local.new_property.text.trim() !== "") {
                addNew();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (local.new_property.text.trim() !== "") {
                  addNew();
                }
              }
            }}
          />
        </div>
      </Tooltip>
    </div>
  );
};
