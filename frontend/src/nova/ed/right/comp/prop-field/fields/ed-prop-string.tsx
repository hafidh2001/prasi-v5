import trim from "lodash.trim";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { extractRegion, removeRegion } from "popup/script/code/js/migrate-code";
import { codeUpdate } from "popup/script/code/prasi-code-update";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { AutoHeightTextarea } from "utils/ui/auto-textarea";
import { EdPropCode } from "./ed-prop-code";
import { getActiveNode } from "crdt/node/get-node-by-id";

export const EdPropString = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ value: "", has_code: false, original_value: "" });
  const { name, instance, field } = arg;

  useEffect(() => {
    let prop = instance.props[name];
    if (!prop) {
      const comp_id = getActiveNode(p)?.item?.component?.id;
      if (comp_id) {
        const comp = p.comp.loaded[comp_id];
        const cprop = comp?.content_tree.component?.props[name];
        prop = JSON.parse(JSON.stringify(cprop));
      } else {
        return;
      }
    }
    local.original_value = prop.value;

    let value = prop.value || "";
    if (!value) {
      local.has_code = false;
      local.value = "";
      return;
    }

    const extracted_str = extractString(name, value.trim());
    if (extracted_str) {
      value = trim(extracted_str, `\`"'`);
      local.has_code = false;
    } else {
      local.has_code = true;
    }
    local.value = value;
    local.render();
  }, [instance.props[name]?.value]);

  if (local.has_code) {
    return <EdPropCode {...arg} />;
  }

  if (field.label === "_") {
    const fn = new Function(`return ${field.valueBuilt}`);
    const result = fn() as { label: string; onClick: () => {} }[];
    return (
      <div className="flex items-center">
        <div
          className="hover:bg-blue-600 px-2 hover:text-white border"
          onClick={() => {
            result[0].onClick();
          }}
        >
          {result[0].label}
        </div>
      </div>
    );
  }

  return (
    <AutoHeightTextarea
      spellCheck={false}
      value={local.value}
      onChange={(e) => {
        const text = e.currentTarget.value;
        local.value = text;
        local.render();

        const region = extractRegion(local.original_value);
        let value = "";
        if (region.length > 0) {
          value = `${region.join("\n")}`;
        }

        value += `

export const ${name} = \`${text}\`;
        `;
        codeUpdate.push(p, active.item_id, value, { prop_name: name });
      }}
      className={cx(
        "flex-1 py-1 px-1 border-l  flex w-full border-0 outline-none min-h-[29px]",
        css`
          background: white;
          color: black;
        `
      )}
    />
  );
};

export const extractString = (name: string, str: string): string => {
  if (str.charAt(0) === "(" && str.charAt(str.length - 1) === ")") {
    let substr= str.slice(1, -1);
    if (['"', "'", "`"].includes(substr.charAt(0))) {
      if (substr.charAt(substr.length - 1) === substr.charAt(0)) {
        return substr;
      }
    }
  } else if (['"', "'", "`"].includes(str.charAt(0))) {
    if (str.charAt(str.length - 1) === str.charAt(0)) {
      return str;
    }
  }

  let no_region = removeRegion(str);
  if (no_region.startsWith(`export const ${name} =`)) {
    if (no_region.endsWith(";")) {
      no_region = no_region.slice(0, -1);
    }
    return extractString(
      name,
      no_region.slice(`export const ${name} =`.length).trim()
    );
  }
  return "";
};
