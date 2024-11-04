import get from "lodash.get";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { FNCompDef } from "utils/types/meta-fn";
import { EdMasterPropDetail } from "./ed-mp-popover";
import set from "lodash.set";

export const EdMasterPropName: FC<{
  name: string;
  prop: FNCompDef;
}> = ({ name, prop }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const is_active = p.ui.tree.comp.active === name;

  if (!prop) return null;

  const is_same_name = !prop.label || prop.label === name;
  const is_group = name.includes("__");
  const is_group_child = is_group && !name.endsWith("__");

  const content = (
    <div
      className={cx(
        "flex-1 py-1 cursor-pointer text-sm flex items-center",
        is_active ? "bg-blue-500 text-white" : "hover:bg-blue-50"
      )}
      onClick={() => {
        p.ui.tree.comp.active = name;
        p.render();
      }}
    >
      <div
        className={cx(
          "justify-between flex-1 flex items-center",
          !is_group && "px-1"
        )}
      >
        {is_same_name ? (
          <>{prop.label || name}</>
        ) : (
          <>
            <div>{prop.label}</div>
            {(is_group_child || !is_group) && (
              <div className="font-mono text-[10px]">{name}</div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (is_active) {
    return (
      <EdMasterPropDetail
        onClose={() => {
          p.ui.tree.comp.active = "";
          p.render();
        }}
        children={content}
      />
    );
  }
  return content;
};
