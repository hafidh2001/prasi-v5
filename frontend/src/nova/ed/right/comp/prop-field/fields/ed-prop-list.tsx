import { EDGlobal } from "logic/ed-global";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { EdPropCode } from "./ed-prop-code";
import { extractValue } from "./extract-value";

export const EdPropListHead = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ value: "", has_code: false, original_value: "" });
  const { name, instance, field } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      local.value = e.value;
      console.log(local.value);
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  return <div className={cx("flex items-center px-1 flex-1 bg-white")}></div>;
};

export const EdPropList = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ value: "", has_code: false, original_value: "" });
  const { name, instance } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      local.value = e.value;
      console.log(local.value);
    }
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  return (
    <div className={cx("flex items-center px-1 flex-1 bg-white")}>
      <div>MOKO</div>
    </div>
  );
};
