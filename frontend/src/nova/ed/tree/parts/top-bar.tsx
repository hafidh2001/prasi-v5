import { Lock, Pencil, Plus } from "lucide-react";
import { TopBtn } from "../../ui/top-btn";
import { edActionAdd } from "../action/add";
import { active } from "logic/active";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";
import { getNodeById } from "crdt/node/get-node-by-id";
export const EdTreeTopBar = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  return (
    <div className="p-1 border-b flex items-stretch justify-between text-xs bg-slate-100">
      <div
        className={cx(css`
          .top-btn {
            padding-left: 6px;
            background: white;
            &:hover {
              background: #3c82f6;
            }
          }
        `)}
      >
        <TopBtn
          onClick={() => {
            edActionAdd(p);
          }}
        >
          <Plus size={11} />
          <div>Add</div>
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
