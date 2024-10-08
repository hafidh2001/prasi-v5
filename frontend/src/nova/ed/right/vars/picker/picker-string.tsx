import { ToggleLeft, ToggleRight } from "lucide-react";
import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { Switch } from "utils/shadcn/comps/ui/switch";

export const EdPickerString: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const local = useLocal({ value: value || "" });

  useEffect(() => {
    local.value = value || "";
    if (value + "" !== local.value) {
      onChange(local.value);
    } else {
      local.render();
    }
  }, [value]);

  return (
    <input
      className="outline-none flex-1 focus:border-blue-500 border px-1 mr-1"
      type="text"
      value={local.value}
      onChange={(event) => {
        local.value = (event.target as HTMLInputElement).value;
        local.render();
      }}
      spellCheck={false}
      onBlur={(e) => {
        if (value !== local.value) {
          onChange(local.value);
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
