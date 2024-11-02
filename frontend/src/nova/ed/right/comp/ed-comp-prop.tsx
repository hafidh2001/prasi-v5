import { getActiveNode } from "crdt/node/get-node-by-id";
import { EDGlobal } from "logic/ed-global";
import { Sticker } from "lucide-react";
import { waitUntil } from "prasi-utils";
import { useEffect, useState } from "react";
import { useGlobal } from "utils/react/use-global";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { EdPropField } from "./prop-field/ed-prop-field";
import { useLocal } from "utils/react/use-local";
import { loadCompTree } from "crdt/load-comp-tree";

export const EdCompProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ comp_id: "", loading: false });
  const node = getActiveNode(p);
  const ui = p.ui.comp.prop;
  const comp_id = node?.item.component?.id || "";
  const comp_def = p.comp.loaded[comp_id];
  const comp = comp_def?.content_tree.component;
  const instance = node?.item?.component;
  useEffect(() => {
    if (local.comp_id !== comp_id) {
      if (!local.loading) {
        local.loading = true;
        local.comp_id = comp_id;

        if (p.comp.pending.has(comp_id)) {
          waitUntil(() => {
            return !p.comp.pending.has(comp_id);
          }).then(async () => {
            local.loading = false;
            local.render();

            const item = p.comp.loaded[comp_id].content_tree;
            if (!item.component && p.sync) {
              const tree = await loadCompTree({
                id: local.comp_id,
                p,
                sync: p.sync,
                activate: false,
              });
              tree.update("Prep Component", ({ tree }) => {
                tree.component = { id: comp_id, props: {} };
              });
              tree.destroy();
            }
          });
        }
      }
    }
  }, [comp_id]);

  if (!node || !instance || !comp || local.loading) {
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
              p.ui.popup.script.open = true;
              p.render();
            }}
          />
        </Menu>
      )}
    </div>
  );
};
