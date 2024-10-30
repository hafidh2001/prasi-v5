import { getActiveNode } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { HistoryIcon } from "lucide-react";
import { Resizable } from "re-resizable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";

export const EdCodeHistory = () => {
  return (
    <Popover content={<HistoryList />} asChild backdrop={false}>
      <div className="flex items-center ml-1">
        <div className={cx("top-btn space-x-1")}>
          <HistoryIcon size={12} /> <div>History</div>
        </div>
      </div>
    </Popover>
  );
};

const HistoryList = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ list: [] }, async () => {
    const node = getActiveNode(p);
    console.log(
      await _api._compressed.code_history({
        mode: "list",
        site_id: p.site.id,
        selector: {
          comp_id: active.comp_id ? active.comp_id : undefined,
          page_id: !active.comp_id ? p!.page.cur.id : undefined,
          item_id: active.item_id,
          type:
            node?.item.component?.id && p.ui.comp.prop.active
              ? "prop"
              : p.ui.popup.script.mode,
          prop_name:
            node?.item.component?.id && p.ui.comp.prop.active
              ? p.ui.comp.prop.active
              : undefined,
        },
      })
    );
  });
  return (
    <Resizable
      defaultSize={{
        width:
          parseInt(localStorage.getItem("prasi-code-history-w") || "") || 200,
        height:
          parseInt(localStorage.getItem("prasi-code-history-h") || "") || 300,
      }}
      minWidth={200}
      minHeight={300}
      onResizeStop={(_, __, div) => {
        localStorage.setItem(
          "prasi-code-history-w",
          div.clientWidth.toString()
        );
        localStorage.setItem(
          "prasi-code-history-h",
          div.clientHeight.toString()
        );
      }}
      className={cx("text-sm")}
    ></Resizable>
  );
};
