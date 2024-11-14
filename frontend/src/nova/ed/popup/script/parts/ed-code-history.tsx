import { getActiveNode } from "crdt/node/get-node-by-id";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileClock,
  Sticker,
} from "lucide-react";
import { Resizable } from "re-resizable";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { LoadingSpinner } from "utils/ui/loading";
import { Popover } from "utils/ui/popover";

dayjs.extend(relativeTime);

export const EdCodeHistory: FC<{
  history_id: number;
  onHistoryPick: (id: number, should_close: boolean) => void;
}> = ({ onHistoryPick, history_id }) => {
  const local = useLocal({
    open: false,
    list: [] as { ts: number; id: number }[],
    ts: 0,
  });

  const current = local.list.find((item) => item.id === history_id);
  return (
    <>
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
              onHistoryPick(id, true);
            }}
            onInit={({ list, ts }) => {
              local.list = list;
              local.ts = ts;
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
          {!!history_id && (
            <>
              <div
                className={cx(
                  "top-btn",
                  css`
                    border-left: 0 !important;
                    border-right: 0 !important;
                  `
                )}
                onClick={(e) => {
                  e.stopPropagation();

                  const index = local.list.findIndex(
                    (item) => item.id === history_id
                  );

                  if (index > 0) {
                    const back = local.list[index - 1].id;

                    if (back) {
                      onHistoryPick(back, false);
                    }
                  }
                }}
              >
                <ChevronLeft size={12} />
              </div>
              <div
                className={cx("top-btn")}
                onClick={(e) => {
                  e.stopPropagation();

                  const index = local.list.findIndex(
                    (item) => item.id === history_id
                  );
                  if (index >= 0 && index < local.list.length - 1) {
                    const next = local.list[index + 1].id;

                    if (next) {
                      onHistoryPick(next, false);
                    }
                  }
                }}
              >
                <ChevronRight size={12} />
              </div>
            </>
          )}
        </div>
      </Popover>

      {current && (
        <div className={"ml-1 mr-3 text-xs flex items-center"}>
          <div>{dayjs(current.ts).from(local.ts)}</div>
          <div className="border border-white border-opacity-40 rounded-sm ml-1 px-1">
            {dayjs(current.ts).format("DD MMM YYYY - HH:mm:ss")}
          </div>
        </div>
      )}
    </>
  );
};

const HistoryList: FC<{
  onHistoryPick: (ts: number) => void;
  history_id: number;
  onInit: (opt: { ts: number; list: { ts: number; id: number }[] }) => void;
}> = ({ onHistoryPick, history_id, onInit }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal(
    {
      ts: 0,
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

  onInit({
    ts: local.ts,
    list: local.list,
  });

  return (
    <Resizable
      defaultSize={{
        width:
          parseInt(localStorage.getItem("prasi-code-history-w") || "") || 260,
        height:
          parseInt(localStorage.getItem("prasi-code-history-h") || "") || 200,
      }}
      minWidth={260}
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
            <div>{dayjs(item.ts).from(local.ts)}</div>
            <div className="border border-black border-opacity-20 rounded-sm ml-3 px-1">
              {dayjs(item.ts).format("DD MMM YYYY - HH:mm:ss")}
            </div>
          </div>
        );
      })}
    </Resizable>
  );
};
