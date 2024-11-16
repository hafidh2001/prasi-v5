import { EDGlobal } from "logic/ed-global";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { EdPropCode } from "./ed-prop-code";
import { extractValue } from "./extract-value";
import { active, getActiveTree } from "logic/active";

export const EdPropListHead = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    value: [] as any[],
    has_code: false,
    original_value: "",
  });
  const { name, instance } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      if (e.value.startsWith("[")) {
        const fn = new Function(`return ${e.value}`);
        local.value = fn();
      }
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  return (
    <div className={cx("flex items-center justify-end px-1 flex-1 bg-white")}>
      <div
        className="border pl-[3px] pr-[6px] flex items-center space-x-1 hover:bg-blue-600 hover:text-white rounded-sm text-xs"
        onClick={() => {
          const fn = new Function(
            `return ${arg.field.meta?.optionsBuilt || ""}`
          );
          const item = createListItem(fn());

          getActiveTree(p).update(
            `${"Add Item to Prop "} ${name}`,
            ({ findNode }) => {
              const n = findNode(active.item_id);

              if (n && n.item.component?.props) {
                local.value.push(item);
                n.item.component.props[name].value = JSON.stringify(
                  local.value
                );
                n.item.component.props[name].valueBuilt =
                  n.item.component.props[name].value;
              }
            }
          );
        }}
      >
        <PlusCircle size={11} /> <div className="mt-[2px]">Add New</div>
      </div>
    </div>
  );
};

type ListStructureItem = { type: "string" } | { type: "object" };

const createListItem = (structures: ListStructureItem) => {
  if (structures.type === "string") {
    return "";
  } else if (structures.type === "object") {
    const item = {};
    return item;
  }
};

export const EdPropList = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    value: [] as any[],
    has_code: false,
    original_value: "",
  });
  const { name, instance } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      if (e.value.startsWith("[")) {
        const fn = new Function(`return ${e.value}`);
        local.value = fn();
      }
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  return (
    <div className={cx("flex items-center px-1 flex-1 bg-white")}>
      {JSON.stringify(local.value)}
    </div>
  );
};
