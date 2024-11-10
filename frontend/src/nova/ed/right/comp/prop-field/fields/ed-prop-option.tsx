import trim from "lodash.trim";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { extractRegion } from "popup/script/code/js/migrate-code";
import { codeUpdate } from "popup/script/code/prasi-code-update";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Dropdown } from "utils/ui/dropdown";
import { extractString } from "./ed-prop-string";
import { EdPropCheckbox } from "./ed-prop-checkbox";

export const EdPropOption = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const { name, field, instance } = arg;
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    options: [] as { label: string; value: string }[],
    has_code: false,
    value: "",
  });
  const ui = p.ui.comp.prop;
  let prop = instance.props[name];

  const resetValue = (input_value?: string) => {
    const src = field.meta?.optionsBuilt || field.meta?.options;
    if (src) {
      let value = input_value || prop?.value || "";

      const extracted_str = extractString(name, value.trim());
      if (extracted_str) {
        value = trim(extracted_str, `\`"'`);
        local.has_code = false;
      } else {
        local.has_code = true;
      }
      local.value = value;

      const fn = new Function(`return ${src}`);
      try {
        local.options = fn();

        local.options = (local.options || []).map((e) => {
          if (typeof e === "string") {
            return { label: e, value: e };
          }
          return e;
        });
      } catch (e) {
        console.warn(e);
      }
      local.render();
    }
  };
  useEffect(() => {
    resetValue();
  }, [prop?.value]);

  const setValue = (text: string) => {
    const region = extractRegion(prop?.value || "");
    let value = "";
    if (region.length > 0) {
      value = `${region.join("\n")}`;
    }

    value += `

export const ${name} = \`${text}\`;
  `;
    codeUpdate.push(p, active.item_id, value, { prop_name: name });
    resetValue(text);
  };

  const mode = field.meta?.option_mode || "button";

  return (
    <div className="flex items-stretch flex-1 border-l bg-white">
      {mode === "dropdown" && (
        <Dropdown
          items={local.options}
          value={local.value}
          onChange={setValue}
          className={cx(
            "flex-1",
            css`
              background: blue;
            `
          )}
        />
      )}
      {mode === "button" && (
        <div className="flex space-x-1 p-1">
          {local.options.map((e, idx) => {
            return (
              <div
                key={idx}
                className={cx(
                  "border px-1 rounded-[3px] cursor-pointer flex items-center justify-center",
                  local.value === e.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border hover:bg-blue-100"
                )}
                onClick={() => {
                  setValue(e.value);
                }}
              >
                {e.label}
              </div>
            );
          })}
        </div>
      )}
      {mode === "checkbox" && <EdPropCheckbox {...arg} />}
    </div>
  );
};
