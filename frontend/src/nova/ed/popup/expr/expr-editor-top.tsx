import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { PExpr } from "./lib/types";

export const EdExprEditorTop: FC<{
  value?: PExpr;
  onChange: (value: PExpr) => void;
  item_id: string;
}> = ({ value, onChange }) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <div
      onContextMenu={(e) => {
        e.stopPropagation();
      }}
      className="flex border-b border-b-slate-300 p-1 bg-slate-50"
    >
      mantap jiwa
    </div>
  );
};
