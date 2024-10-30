import { getActiveNode } from "crdt/node/get-node-by-id";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { Check, FileClock, Sticker } from "lucide-react";
import { Resizable } from "re-resizable";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { LoadingSpinner } from "utils/ui/loading";
import { Popover } from "utils/ui/popover";

dayjs.extend(relativeTime);

export const EdCodeHistory: FC<{
  history_id: number;
  onHistoryPick: (id: number) => void;
}> = ({ onHistoryPick, history_id }) => {
  const local = useLocal({ open: false });
  return (
    <Popover
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
      content={
        <HistoryList
          history_id={history_id}
          onHistoryPick={(id) => {
            local.open = false;
            local.render();
            onHistoryPick(id);
          }}
        />
      }
      asChild
      backdrop={false}
    >
      <div className="flex items-center ml-1">
        <div className={cx("top-btn space-x-1")}>
          <FileClock size={12} />
          <div>History</div>
        </div>
      </div>
    </Popover>
  );
};

const HistoryList: FC<{
  onHistoryPick: (ts: number) => void;
  history_id: number;
}> = ({ onHistoryPick, history_id }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      ts: dayjs(),
      loading: true,
      list: [] as { ts: number; id: number }[],
    },
    async () => {
      const node = getActiveNode(p);

      const res = await _api._compressed.code_history({
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
      });

      local.ts = res.ts;
      local.list = res.list || [];
      local.loading = false;
      local.render();
    }
  );
  return (
    <Resizable
      defaultSize={{
        width:
          parseInt(localStorage.getItem("prasi-code-history-w") || "") || 200,
        height:
          parseInt(localStorage.getItem("prasi-code-history-h") || "") || 200,
      }}
      minWidth={200}
      minHeight={200}
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
    >
      {local.list.length === 0 && (
        <div
          className={cx(
            "flex items-center flex-col text-center justify-center space-y-2 flex-1 w-full h-full"
          )}
        >
          {local.loading && (
            <div className={cx("text-center py-4")}>
              <LoadingSpinner /> Loading...
            </div>
          )}
          {!local.loading && (
            <>
              <Sticker size={35} strokeWidth={1} />
              No History
            </>
          )}
        </div>
      )}
      {local.list.map((item, idx) => {
        return (
          <div
            key={idx}
            className={cx(
              "flex px-2 text-xs py-1 cursor-pointer border-b items-center",
              history_id === item.id
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100"
            )}
            onClick={() => {
              onHistoryPick(item.id);
            }}
          >
            {history_id === item.id && <Check size={12} className="mr-1" />}
            {dayjs(item.ts).from(local.ts)}
          </div>
        );
      })}
    </Resizable>
  );
};
