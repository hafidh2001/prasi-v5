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
import { extractValue } from "./extract-value";
import { Popover } from "utils/ui/popover";
import { ChevronLeft, ChevronLeftCircle } from "lucide-react";

export const EdPropString = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ value: "", has_code: false, original_value: "" });
  const { name, instance, field } = arg;
  const prop = instance.props[name];

  useEffect(() => {
    const e = extractValue(p, name, prop);
    if (e) {
      local.original_value = e.original_value;
      local.has_code = e.has_code;
      local.value = e.value;
    }
    local.render();
    p.ui.comp.prop.render_prop_editor();
  }, [instance.props[name]?.value]);

  if (local.has_code || arg.field.meta?.text_mode === "code") {
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

  const result = (
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
        "flex-1 py-1 px-1 flex w-full border-0 outline-none min-h-[29px]",
        css`
          background: white;
          color: black;
        `
      )}
    />
  );

  if (typeof prop.value === "string" && prop.value.length > 60) {
    return (
      <div className="flex items-center flex-1 px-1">
        <Popover
          placement="left"
          content={<div className="w-[700px] font-mono text-sm">{result}</div>}
          asChild
          className="flex items-center justify-center px-1 hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 border bg-slate-50 rounded-sm"
        >
          <ChevronLeftCircle size={12} className="mr-1" />
          Long Text...
        </Popover>
      </div>
    );
  }

  return result;
};
