import { HistoryIcon } from "lucide-react";
import { Resizable } from "re-resizable";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";

export const EdScriptHistory = () => {
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
