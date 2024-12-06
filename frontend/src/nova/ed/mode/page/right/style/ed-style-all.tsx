import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, useCallback, useEffect } from "react";
import { deepClone, useGlobal } from "utils/react/use-global";
import { PanelAutoLayout } from "./panel/auto-layout";
import { PanelBackground } from "./panel/background";
import { PanelBorder } from "./panel/border";
import { PanelDimension } from "./panel/dimension";
import { PanelFont } from "./panel/font";
import { PanelPadding } from "./panel/padding";
import { SideBox } from "./ui/SideBox";
import { SideLabel } from "./ui/SideLabel";
import set from "lodash.set";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { waitUntil } from "prasi-utils";
import { num_drag } from "./ui/FieldNumUnit";

export const EdStyleAll: FC<{ as_child?: boolean }> = ({ as_child }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ item: null as IItem | null, timeout: null as any });
  let is_inherit = false;

  useEffect(() => {
    let active_item = getActiveNode(p)?.item;
    if (!active_item) {
      waitUntil(() => getActiveNode(p)?.item).then(() => {
        const active_item = getActiveNode(p)?.item;
        if (active_item) {
          local.item = deepClone(active_item);
          local.render();
        }
      });
    } else {
      local.item = deepClone(active_item);
      local.render();
    }
  }, [active.item_id]);
  const item = local.item;

  num_drag.disable_highlight = () => {
    if (p.ui.editor.hover === "enabled") {
      p.ui.editor.hover = "temporary-disabled";
      p.render();
    }
  };

  const update = useCallback(async (key: any, value: any) => {
    if (local.item) {
      set(local.item, key, value);
      local.item = { ...local.item };
      local.render();
      if (p.ui.editor.hover === "enabled") {
        p.ui.editor.hover = "temporary-disabled";
        p.render();
      }
    }
    clearTimeout(local.timeout);
    local.timeout = setTimeout(() => {
      getActiveTree(p).update(`Update style ${key}`, ({ findNode }) => {
        const n = findNode(active.item_id);
        if (n) {
          set(n.item, key, value);
        }
      });
    }, 100);
  }, []);

  if (!item) return null;

  const childs = (
    <>
      <SideBox>
        <PanelAutoLayout mode={p.mode} value={item} update={update} />
      </SideBox>
      <div className="flex items-stretch justify-between border-t pt-1 px-2 pb-2">
        <PanelDimension
          value={item}
          mode={p.mode}
          id={active.item_id}
          update={update}
        />
        <PanelPadding
          id={active.item_id}
          value={item}
          mode={p.mode}
          update={update}
        />
      </div>
      <SideLabel>BACKGROUND</SideLabel>
      <SideBox>
        <PanelBackground value={item} mode={p.mode} update={update} />
      </SideBox>
      <SideLabel>FONT</SideLabel>
      <SideBox>
        <PanelFont value={item} mode={p.mode} update={update} />
      </SideBox>
      <SideLabel>BORDER</SideLabel>
      <SideBox>
        <PanelBorder value={item} mode={p.mode} update={update} />
      </SideBox>
    </>
  );

  if (!is_inherit && !as_child)
    return (
      <div className="flex h-full flex-1 relative overflow-auto">
        <div className="absolute inset-0 flex items-stretch flex-col pt-1">
          {childs}
        </div>
      </div>
    );

  return childs;
};
