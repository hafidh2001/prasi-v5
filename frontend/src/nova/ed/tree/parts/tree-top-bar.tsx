import { EDGlobal } from "logic/ed-global";
import { Lock, Pencil, Plus } from "lucide-react";
import { useGlobal } from "utils/react/use-global";
import { IItem } from "utils/types/item";
import { TopBtn } from "../../ui/top-btn";
import { edActionAdd } from "../action/add";
import { ComponentIcon, ItemIcon } from "./node/node-indent";
import { createId } from "@paralleldrive/cuid2";
import { decorateEComp } from "crdt/node/load-child-comp";

export const EdTreeTopBar = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  return (
    <div className="p-1 border-b flex items-stretch justify-between text-xs bg-slate-100">
      <div
        className={cx(
          "flex items-stretch",
          css`
            .top-btn {
              background: white;
              font-size: 11px;
              padding: 0 4px;
              &:hover {
                background: #3c82f6;
              }
            }
          `
        )}
      >
        <div className="px-1 bg-white text-slate-400 flex items-center border border-r-0 border-slate-300">
          <Plus size={11} />
        </div>
        <TopBtn
          className={cx(
            "rounded-none border-x-0",
            css`
              border-left: 1px solid #ececeb;
            `
          )}
          onClick={() => {
            edActionAdd(p);
          }}
        >
          <ItemIcon />
          <div>ITEM</div>
        </TopBtn>

        <TopBtn
          className={cx(
            "rounded-l-none border-l-0",
            css`
              border-left: 1px solid #ececeb;
              padding-right: 6px !important;
            `
          )}
          onClick={() => {
            p.ui.popup.comp.on_pick = async (comp_id) => {
              if (p.sync) {
                if (!p.comp.loaded[comp_id]) {
                  const comps = await p.sync.comp.load([comp_id]);
                  for (const comp of Object.values(comps)) {
                    p.comp.loaded[comp.id] = decorateEComp(p, comp);
                  }
                }
                const comp = p.comp.loaded[comp_id];
                if (comp) {
                  const new_item: IItem = {
                    id: createId(),
                    name: comp.content_tree.name,
                    type: "item",
                    component: { id: comp_id, props: {} },
                    childs: [],
                  };
                  edActionAdd(p, new_item);
                }
              }
            };
            p.render();
          }}
        >
          <ComponentIcon />
          <div>COMP</div>
        </TopBtn>
      </div>
      <div
        className={cx(css`
          .top-btn {
            border-color: transparent;
            padding: 0px 3px;
          }
        `)}
      >
        <TopBtn
          onClick={() => {
            p.ui.comp.editable = !p.ui.comp.editable;
            p.render();
          }}
          className={cx(p.ui.comp.editable && "text-green-700")}
        >
          {p.ui.comp.editable ? <Pencil size={12} /> : <Lock size={9} />}{" "}
          <div>Comp {p.ui.comp.editable ? "Editable" : "Locked"}</div>
        </TopBtn>
      </div>
    </div>
  );
};
