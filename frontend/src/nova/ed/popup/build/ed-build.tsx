import { EDGlobal } from "logic/ed-global";
import { Package } from "lucide-react";
import { Resizable } from "re-resizable";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Popover } from "utils/ui/popover";

export const EdBundle = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    open: false,
    size: localStorage.getItem("prasi-var-edit-size") || "700*400",
  });
  const [height, width] = local.size.split("*").map(Number);

  return (
    <Popover
      open={local.open}
      placement="bottom"
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
      arrow={false}
      offset={0}
      content={
        <Resizable
          defaultSize={{
            height,
            width,
          }}
          onResizeStop={(_, __, div) => {
            localStorage.setItem(
              "prasi-var-edit-size",
              div.clientHeight.toString() + "*" + div.clientWidth.toString()
            );
          }}
        ></Resizable>
      }
      className={cx(
        "border-l cursor-pointer  flex items-center justify center border-r px-2 mr-2 select-none space-x-1",
        local.open ? "bg-purple-600 text-white" : "hover:text-purple-600"
      )}
    >
      <Package size={14} /> <div className="">Bundle</div>
    </Popover>
  );
};
