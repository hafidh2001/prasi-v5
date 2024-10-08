import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";

export const EdPickerNumber: FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({ value: value + "" });

  useEffect(() => {
    local.value = (value + "").replace(/\D/g, "");
  }, [value]);

  return (
    <input
      className="outline-none flex-1 focus:border-blue-500 border px-1 mr-1"
      type="text"
      tabIndex={0}
      value={local.value}
      placeholder="Value"
      onChange={(event) => {
        local.value = (event.target as HTMLInputElement).value.replace(
          /\D/g,
          ""
        );
        local.render();
      }}
      spellCheck={false}
      onBlur={(e) => {
        if (value + "" !== local.value) {
          onChange(Number(local.value));
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
};
