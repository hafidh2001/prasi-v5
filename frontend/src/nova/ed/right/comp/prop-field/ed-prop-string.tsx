import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { AutoHeightTextarea } from "utils/ui/auto-textarea";

export const EdPropString = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  return (
    <AutoHeightTextarea
      spellCheck={false}
      className="flex-1 py-1 px-2 border-l bg-white flex w-full border-0 outline-none min-h-[29px]"
    />
  );
};
