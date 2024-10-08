import { ToggleLeft, ToggleRight } from "lucide-react";
import { FC } from "react";
import { Switch } from "utils/shadcn/comps/ui/switch";

export const EdPickerBoolean: FC<{
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ value, onChange }) => {
  if (typeof value === "boolean") {
    onChange(!!value);
  }

  return (
    <label className="flex items-center">
      <Switch
        checked={!!value}
        onClick={() => {
          onChange(!value);
        }}
      />
      <div className="capitalize ml-1">{JSON.stringify(!!value)}</div>
    </label>
  );
};
