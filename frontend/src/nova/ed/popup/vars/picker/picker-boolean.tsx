import { ToggleLeft, ToggleRight } from "lucide-react";
import { FC } from "react";
import { Switch } from "utils/shadcn/comps/ui/switch";

export const EdPickerBoolean: FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  if (typeof value === "boolean") {
    onChange(!!value);
  }

  return (
    <label className={cx("flex items-center", className)}>
      <Switch
        checked={!!value}
        onClick={() => {
          onChange(!value);
        }}
        tabIndex={0}
      />
      <div className="capitalize ml-1">{JSON.stringify(!!value)}</div>
    </label>
  );
};
