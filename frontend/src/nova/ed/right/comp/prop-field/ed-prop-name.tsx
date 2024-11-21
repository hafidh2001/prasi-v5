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
  const label = field.label || name;
  return (
    <div
      onClick={onClick}
      className={cx(
        "flex items-center pl-2 select-none  overflow-hidden",
        field.meta?.type !== "list" && "flex-1 max-w-[100px]"
      )}
    >
      {label === "_" ? "" : label}
    </div>
  );
};
