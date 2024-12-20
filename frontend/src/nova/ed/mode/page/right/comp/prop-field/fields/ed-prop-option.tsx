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
import { EdPropCheckbox } from "./ed-prop-checkbox";
import { extractString } from "./extract-value";
import { waitUntil } from "prasi-utils";

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
  let prop = instance.props[name];

  const resetValue = async (input_value?: string) => {
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

      let comp_props = p.viref.comp_props?.[active.item_id];
      if (!comp_props) {
        await waitUntil(() => p.viref.comp_props?.[active.item_id]);
        comp_props = p.viref.comp_props?.[active.item_id];
      }

      const exports = p.viref.vscode_exports || {};
      if (comp_props) {
        const fn = new Function(
          ...Object.keys(comp_props),
          ...Object.keys(exports),
          `return ${src}`
        );
        try {
          local.options = fn(
            ...Object.values(comp_props),
            ...Object.values(exports)
          );

          local.options = (local.options || []).map((e) => {
            if (typeof e === "string") {
              return { label: e, value: e };
            }
            return e;
          });
        } catch (e) {
          console.warn(e);
        }

        comp_props[name] = local.value;

        p.ui.comp.prop.render_prop_editor(true);
        local.render();
      }
    }
  };

  useEffect(() => {
    resetValue();
  }, [prop?.value, p.viref.comp_props[active.item_id]]);

  const setValue = (text: string) => {
    const region = extractRegion(prop?.value || "");
    let value = "";
    if (region.length > 0) {
      value = `${region.join("\n")}`;
    }

    value += `

export const ${name} = \`${text}\`;
  `;
    codeUpdate.push(p, active.item_id, value, {
      prop_name: name,
      immediate: true,
    });
    resetValue(text);
  };

  const mode = field.meta?.option_mode || "button";

  return (
    <div className="flex items-stretch flex-1 bg-white">
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
        <div className={cx("flex p-1 flex-wrap pb-0")}>
          {local.options.map((e, idx) => {
            return (
              <div
                key={idx}
                className={cx(
                  "border px-1 rounded-[3px] flex-nowrap cursor-pointer flex items-center justify-center mr-1 mb-1",
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
      {mode === "checkbox" && (
        <EdPropCheckbox {...arg} options={local.options} />
      )}
    </div>
  );
};
