import { EDGlobal } from "logic/ed-global";
import { ChevronRight } from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { EdPropName } from "./ed-prop-name";
import { EdPropString } from "./fields/ed-prop-string";
import { EdPropOption } from "./fields/ed-prop-option";

export const EdPropField = (arg: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  const { name, field, instance } = arg;
  const p = useGlobal(EDGlobal, "EDITOR");
  const ui = p.ui.comp.prop;

  const is_jsx = field.meta?.type === "content-element";

  return (
    <div
      className={cx(
        "border-b min-h-[30px] cursor-pointer relative flex items-stretch select-none",
        ui.active === name
          ? cx(
              "bg-blue-600 text-white",
              css`
                .bg-white {
                  background: transparent;
                }
              `
            )
          : "hover:bg-blue-100"
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        ui.context_event = e;
        ui.context_name = name;
        p.render();
      }}
    >
      {ui.active === name && (
        <div
          className={cx(
            "flex items-center absolute left-0 bottom-0 top-0",
            css`
              border-left: 2px solid white;
              svg {
                margin-left: -8px;
              }
              margin-right: -10px;
            `
          )}
        >
          <ChevronRight fill={"white"} size={20} />
        </div>
      )}
      <EdPropName
        name={name}
        field={field}
        onClick={(e) => {
          e.preventDefault();
          if (ui.active) {
            ui.active = "";
            p.render();
            setTimeout(() => {
              ui.active = name;
              p.render();
            }, 50);
          } else {
            ui.context_event = e;
            ui.context_name = name;
            p.render();
          }
        }}
      />
      {is_jsx ? (
        <div className="flex-1 flex justify-end items-center">
          <div className="border flex items-center max-h-[15px] px-2 text-[10px] bg-white border-purple-600 text-purple-600">
            JSX
          </div>
        </div>
      ) : (
        <>
          {field.type === "string" && <EdPropString {...arg} />}
          {field.type === "option" && <EdPropOption {...arg} />}
        </>
      )}
    </div>
  );
};
