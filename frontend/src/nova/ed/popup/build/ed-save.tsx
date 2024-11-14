import { EDGlobal } from "logic/ed-global";
import {
  CheckCheck,
  Save
} from "lucide-react";
import { useGlobal } from "utils/react/use-global";

export const EdSave = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <>
      {p.ui.page.saving && (
        <div
          className={cx(
            "flex items-center",
            !p.ui.page.saved ? "text-purple-600" : "text-green-700"
          )}
        >
          <Save
            size={12}
            strokeWidth={1.5}
            className={cx(
              "mr-1",
              !p.ui.page.saved ? "animate-pulse duration-500" : ""
            )}
          />
          {p.ui.page.saved && (
            <div className="-ml-[10px] rounded-md -mb-2 px-[2px] bg-white">
              <CheckCheck
                size={11}
                strokeWidth={3}
                className="text-green-700"
              />
            </div>
          )}
          <div className={cx("text-[9px]")}>
            {p.ui.page.saved ? "Saved" : "Saving..."}
          </div>
        </div>
      )}
    </>
  );
};
