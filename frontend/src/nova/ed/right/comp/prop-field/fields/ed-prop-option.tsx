import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Dropdown } from "utils/ui/dropdown";

export const EdPropOption = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});
  const ui = p.ui.comp.prop;
  const options = [] as { label: string; value: string }[];

  // console.log(field.meta?.options);

  return (
    <div className="flex items-stretch flex-1 border-l bg-white">
      <Dropdown
        items={options}
        className={cx(
          "flex-1",
          css`
            background: blue;
          `
        )}
      />
    </div>
  );
};
