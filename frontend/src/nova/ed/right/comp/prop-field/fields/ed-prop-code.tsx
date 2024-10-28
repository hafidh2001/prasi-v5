import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";

export const EdPropCode = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const ui = p.ui.comp.prop;

  return (
    <div className="flex items-center justify-end flex-1">
      <div
        className={cx(
          "border border-blue-500 px-2 text-[10px] mx-2 bg-white cursor-pointer hover:bg-blue-600 hover:text-white h-[16px] flex items-center"
        )}
        onClick={() => {
          ui.active = name;
          p.ui.popup.script.mode = "prop";
          p.ui.popup.script.open = true;
          p.render();
        }}
      >
        EDIT CODE
      </div>
    </div>
  );
};
