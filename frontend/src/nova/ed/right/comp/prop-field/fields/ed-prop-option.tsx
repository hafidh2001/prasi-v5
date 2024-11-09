import { active, getActiveTree } from "logic/active";
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
import trim from "lodash.trim";

export const EdPropOption = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
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
      local.options = fn();
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

  return (
    <div className="flex items-stretch flex-1 border-l bg-white">
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
    </div>
  );
};
