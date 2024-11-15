import { getActiveNode } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC, useCallback } from "react";
import { useGlobal } from "utils/react/use-global";
import { PanelAutoLayout } from "./panel/auto-layout";
import { PanelBackground } from "./panel/background";
import { PanelBorder } from "./panel/border";
import { PanelDimension } from "./panel/dimension";
import { PanelFont } from "./panel/font";
import { PanelPadding } from "./panel/padding";
import { SideBox } from "./ui/SideBox";
import { SideLabel } from "./ui/SideLabel";

export const EdStyleAll: FC<{ as_child?: boolean }> = ({ as_child }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  let item = getActiveNode(p)?.item;
  let is_inherit = false;
  if (item?.component?.id) {
  }

  const update = useCallback(async (key: any, value: any) => {
    console.log(key, value);
  }, []);

  if (!item) return null;

  const childs = (
    <>
      <SideBox>
        <PanelAutoLayout mode={p.mode} value={item} update={update} />
        <PanelPadding
          id={active.item_id}
          value={item}
          mode={p.mode}
          update={update}
        />
        <PanelDimension
          value={item}
          mode={p.mode}
          id={active.item_id}
          update={update}
        />
      </SideBox>
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
