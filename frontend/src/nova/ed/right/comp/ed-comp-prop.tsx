import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { Sticker } from "lucide-react";
import { waitUntil } from "prasi-utils";
import { useEffect, useState } from "react";
import { useGlobal } from "utils/react/use-global";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { EdPropField } from "./prop-field/ed-prop-field";

export const EdCompProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const [, render] = useState({});
  const node = getActiveNode(p);
  const ui = p.ui.comp.prop;
  const comp_id = node?.item.component?.id || "";
  const comp_def = p.comp.loaded[comp_id];
  const comp = comp_def?.content_tree.component;
  const instance = node?.item?.component;
  useEffect(() => {
    if (!comp_def) {
      waitUntil(() => p.comp.loaded[comp_id]).then(() => {
        render({});
      });
    }
  }, []);

  if (!node || !instance || !comp) {
    return (
      <div className="flex items-center justify-center flex-1 w-full text-sm h-full flex-col text-center space-y-1">
        <Sticker size={40} strokeWidth={1} />
        <div>
          {!node || !instance ? <>Not a component</> : <>Loading Component</>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 text-sm flex-col items-stretch">
      {Object.entries(comp.props)
        .sort((a, b) => {
          return (a[1].idx || 0) - (b[1].idx || 0);
        })
        .map(([key, field]) => {
          if (field.meta?.type === "content-element") return null;
          return (
            <EdPropField
              key={key}
              name={key}
              field={field}
              instance={instance}
            />
          );
        })}

      {ui.context_event && (
        <Menu
          mouseEvent={ui.context_event}
          onClose={() => {
            ui.context_event = null;
            ui.context_name = "";
            p.render();
          }}
        >
          <MenuItem
            label="Edit code"
            onClick={() => {
              ui.active = ui.context_name;
              p.render();
            }}
          />
        </Menu>
      )}
    </div>
  );
};
