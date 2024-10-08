import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";

export const EdPickerRename: FC<{
  name: string;
  onRename: (arg: {
    path: string[];
    new_name: string;
    old_name: string;
  }) => void;
}> = function (this: { path: string[] }, { name, onRename }) {
  const local = useLocal({ name, disabled: true });

  useEffect(() => {
    local.name = name;
    local.render();
  }, [name]);

  return (
    <input
      className="outline-none flex-1 border-transparent focus:border-blue-500 border px-1 mr-1"
      type="text"
      value={local.name}
      onChange={(event) => {
        local.name = (event.target as HTMLInputElement).value;
        local.render();
      }}
      disabled={local.disabled}
      spellCheck={false}
      onMouseOver={() => {
        local.disabled = false;
        local.render();
      }}
      onMouseOut={(e) => {
        if (e.currentTarget !== document.activeElement) {
          local.disabled = true;
          local.render();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onBlur={(e) => {
        if (name !== local.name) {
          if (local.name) {
            onRename({ path: this.path, new_name: local.name, old_name: name });
          } else {
            local.name = name;
            local.render();
          }
        }

        local.disabled = true;
        local.render();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
};

export const definePickerRename = (arg: { path: string[] }) => {
  return EdPickerRename.bind(arg);
};
