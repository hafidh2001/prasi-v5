import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";

export const EdPickerString: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({ value: value || "", focus: false });

  useEffect(() => {
    if (!local.focus) {
      local.value = value || "";
    }
  }, [value]);

  return (
    <input
      tabIndex={0}
      className="outline-none flex-1 focus:border-blue-500 border px-1 mr-1"
      type="text"
      value={local.value}
      onChange={(event) => {
        local.value = (event.target as HTMLInputElement).value;
        local.render();
      }}
      spellCheck={false}
      onFocus={() => {
        local.focus = true;
        local.render();
      }}
      onBlur={() => {
        onChange(local.value);
      }}
      placeholder="Value"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onChange(local.value);
        }
      }}
    />
  );
};
