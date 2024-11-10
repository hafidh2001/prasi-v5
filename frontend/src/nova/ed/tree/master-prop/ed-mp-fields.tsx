import { getActiveNode } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { monacoRegisterSource } from "popup/script/code/js/create-model";
import { registerPrettier } from "popup/script/code/js/register-prettier";
import { MonacoRaw } from "popup/script/code/monaco-raw";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";

export const FieldButtons = (arg: {
  label: string;
  buttons: (
    | { label: string; checked: () => boolean; check?: () => void }
    | undefined
  )[];
}) => {
  const local = useLocal({
    checked_idx: new Set<number>(),
    timeout: null as any,
  });

  return (
    <div className="flex border-b">
      <div className="w-[50px] p-1">{arg.label}</div>
      <div className="flex space-x-1 items-center px-1 border-l">
        {arg.buttons.map((e, idx) => {
          if (!e) return null;
          return (
            <div
              key={idx}
              className={cx(
                "border px-1 rounded-[3px] cursor-pointer",
                e.checked()
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border hover:bg-blue-100"
              )}
              onClick={() => {
                if (!e.checked() && e.check) {
                  e.check();
                }
              }}
            >
              {e.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const FieldCode = (arg: {
  label: string;
  value?: string;
  default?: string;
  onBeforeChange?: (value: string) => string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}) => {
  const local = useLocal({
    open: false,
    timeout: null as any,
    value: arg.value || arg.default || "",
  });

  useEffect(() => {
    (local.value = arg.value || arg.default || ""), local.render();
  }, [arg.value]);

  return (
    <label className="flex border-b flex-1">
      <div className="w-[50px] p-1">{arg.label}</div>
      <Popover
        placement="right"
        onOpenChange={(open) => {
          local.open = open;

          if (open && !arg.value && arg.default) {
            arg.onChange?.(local.value);
          }

          local.render();
        }}
        open={local.open}
        backdrop={false}
        content={
          <div className={cx("w-[600px] h-[400px]")}>
            <MonacoRaw
              id="field-code"
              lang="typescript"
              value={local.value || ""}
              onChange={(val) => {
                local.value = val;
                clearTimeout(local.timeout);
                local.timeout = setTimeout(() => {
                  arg.onChange?.(val);
                }, 500);
              }}
              onMount={({ monaco }) => {
                const props = Object.keys(
                  active.comp?.snapshot.component?.props || {}
                )
                  .filter((e) => !e.endsWith("__"))
                  .map((prop) => `const ${prop} = null as any;`);
                registerPrettier(monaco);
                monacoRegisterSource(
                  monaco,
                  props.join("\n"),
                  "file:///prop-typings.d.ts"
                );
              }}
            />
          </div>
        }
        className={cx(
          "border-l flex items-center flex-1",
          local.open && "bg-blue-500"
        )}
      >
        <div
          className={cx(
            "border m-1 px-2 cursor-pointer",
            local.open && "border-white text-white"
          )}
        >
          Edit Code
        </div>{" "}
      </Popover>
    </label>
  );
};

export const FieldString = (arg: {
  label: string;
  value: string;
  onBeforeChange?: (value: string) => string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}) => {
  const local = useLocal({ value: "", timeout: null as any });
  useEffect(() => {
    local.value = arg.value;
    local.render();
  }, [arg.value]);
  return (
    <label className="flex border-b">
      <div className="w-[50px] p-1">{arg.label}</div>
      <input
        type="text"
        className="p-1 flex-1 border-l outline-none focus:bg-blue-100"
        value={local.value}
        spellCheck={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
          }
        }}
        onChange={(e) => {
          local.value = e.target.value;

          if (arg.onBeforeChange) {
            local.value = arg.onBeforeChange(local.value);
          }

          local.render();
          clearTimeout(local.timeout);
          local.timeout = setTimeout(() => {
            if (arg.onChange) arg.onChange(local.value);
          }, 300);
        }}
        onBlur={() => {
          if (arg.onBlur) {
            arg.onBlur(local.value);
          }
        }}
      />
    </label>
  );
};

export const FieldDropdown = (arg: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  list: { label: string; value: string }[];
}) => {
  const local = useLocal({ value: "", timeout: null as any });

  useEffect(() => {
    local.value = arg.value;
    local.render();
  }, [arg.value]);

  return (
    <label className="flex border-b">
      <div className="w-[50px] p-1">{arg.label}</div>
      <select
        className="py-1 flex-1 border-l outline-none focus:bg-blue-100"
        value={local.value}
        onChange={(e) => {
          local.value = e.target.value;
          local.render();
          if (arg.onChange) arg.onChange(local.value);
        }}
      >
        {arg.list.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
    </label>
  );
};
