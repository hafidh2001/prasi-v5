import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { monacoRegisterSource } from "popup/script/code/js/create-model";
import { registerPrettier } from "popup/script/code/js/register-prettier";
import { registerReact } from "popup/script/code/js/register-react";
import { MonacoRaw } from "popup/script/code/monaco-raw";
import { remountPrasiModels } from "popup/script/code/prasi-code-update";
import { Resizable } from "re-resizable";
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
    <label className="mp-field flex border-b">
      <div className="mp-label p-1">{arg.label}</div>
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
    </label>
  );
};
export const FieldCode = (arg: {
  label?: string;
  value?: string;
  default?: string;
  typings?: string;
  onBeforeChange?: (value: string) => string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    open: false,
    timeout: null as any,
    value: arg.value || arg.default || "",
    size: localStorage.getItem("prasi-size-code") || "600x400",
  });

  const w = local.size?.split("x")[0];
  const h = local.size?.split("x")[1];

  useEffect(() => {
    if (typeof arg.open === "boolean") {
      local.open = arg.open;
      local.render();
    }
  }, [arg.open]);

  useEffect(() => {
    local.value = arg.value || arg.default || "";
    local.render();
  }, [arg.value]);

  const content = (
    <Popover
      placement="right"
      onOpenChange={(open) => {
        local.open = open;

        if (arg.onOpenChange) {
          arg.onOpenChange(open);
        }
        if (open && !arg.value && arg.default) {
          arg.onChange?.(local.value);
        }

        local.render();
      }}
      open={local.open}
      backdrop={arg.label ? false : true}
      content={
        <Resizable
          className="flex-1 flex"
          defaultSize={{ width: w, height: h }}
          onResizeStop={(_, __, div) => {
            localStorage.setItem(
              "prasi-size-" + name,
              div.clientHeight.toString() + "x" + div.clientWidth.toString()
            );
          }}
        >
          <MonacoRaw
            id="field-code"
            lang="typescript"
            value={local.value || ""}
            onChange={(value) => {
              local.value = value || "";
              clearTimeout(local.timeout);
              local.timeout = setTimeout(() => {
                arg.onChange?.(value || "");
              }, 500);
            }}
            onMount={async ({ editor, monaco }) => {
              const props = Object.keys(
                active.comp?.snapshot.component?.props || {}
              )
                .filter((e) => !e.endsWith("__"))
                .map((prop) => `const ${prop} = null as any;`);

              monacoRegisterSource(
                monaco,
                props.join("\n"),
                "file:///prop-typings.d.ts"
              );
              if (arg.typings) {
                monacoRegisterSource(
                  monaco,
                  arg.typings,
                  "file:///arg-typings.d.ts"
                );
              }

              monacoRegisterSource(
                monaco,
                `import * as ImportReact from "react"; declare global { const React = ImportReact }`,
                "file:///react-typings.ts"
              );

              remountPrasiModels({
                activeFileName: "file:///active-prop.tsx",
                editor,
                monaco,
                p,
                models: [
                  {
                    name: "file:///active-prop.tsx",
                    source: local.value,
                    model: editor.getModel() as any,
                  },
                ],
                async onMount(m) {
                  await registerReact(monaco);
                  registerPrettier(monaco);
                },
              });
            }}
          />
        </Resizable>
      }
      className={cx(
        arg.label && "border-l px-1",
        "flex items-center flex-1 cursor-pointer",
        local.open && "bg-blue-500"
      )}
    >
      <div
        className={cx(
          "border px-2 ",
          local.open
            ? "border-transparent text-white"
            : "bg-white hover:bg-blue-500 hover:text-white"
        )}
      >
        Edit Code
      </div>
    </Popover>
  );

  if (!arg.label) {
    return content;
  }

  return (
    <label className="mp-field flex border-b">
      <div className="mp-label p-1">{arg.label}</div>
      {content}
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
    <label className="mp-field flex border-b">
      <div className="mp-label p-1">{arg.label}</div>
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
    <label className="mp-field flex border-b">
      <div className="mp-label p-1">{arg.label}</div>
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
