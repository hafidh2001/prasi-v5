import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";

export const EdPropCheckbox = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  return <div className="flex space-x-1 p-1"></div>;
};
