import { FNCompDef } from "utils/types/meta-fn";

export const EdPropName = ({
  name,
  field,
}: {
  name: string;
  field: FNCompDef;
}) => {
  return (
    <div className="flex items-center pl-2 select-none flex-1 max-w-[100px] overflow-hidden">
      {field.label || name}
    </div>
  );
};
