import { FNCompDef } from "utils/types/meta-fn";

export const EdPropName = ({
  name,
  field,
  onClick,
}: {
  name: string;
  field: FNCompDef;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center pl-3 select-none flex-1 max-w-[100px] overflow-hidden"
    >
      {field.label || name}
    </div>
  );
};
