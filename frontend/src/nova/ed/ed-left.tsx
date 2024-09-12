import { useGlobal } from "../../utils/react/use-global";
import { useLocal } from "../../utils/react/use-local";
import { Tooltip } from "../../utils/ui/tooltip";
import { EDGlobal } from "./logic/ed-global";
import { EdSitePicker } from "./popup/site/site-picker";
import { EdItemTree } from "./tree/ed-item-tree";
import {
  iconLog,
  iconLogout,
  iconModule,
  iconRebuild,
  iconRebuildLarge,
  iconServer,
  iconSSR,
  iconVSCode,
} from "./ui/icons";

export const EdLeft = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    tree: null as any,
    timeout: null as any,
  });

  if (!local.tree) {
    clearTimeout(local.timeout);
    local.timeout = setTimeout(local.render, 100);
  }

  return (
    <div className={cx("flex flex-1 flex-col relative border-r")}>
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div
          className={cx(
            "h-[35px] border-b flex p-1 items-stretch text-[12px] justify-between",
            css`
              .btn {
                padding: 0px 5px;
                &:hover {
                  border-radius: 3px;
                  color: white;
                  cursor: pointer;
                }
              }
            `
          )}
        >
          <div className="flex items-stretch">
            <EdSitePicker />
            <Tooltip content="Logout" asChild>
              <div
                onClick={() => {
                  if (confirm("Logout ?")) {
                    location.href = "/logout";
                  }
                }}
                className="bg-slate-100 self-center hover:text-white cursor-pointer w-[22px] h-[22px] rounded-sm ml-1 transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconLogout }}
              ></div>
            </Tooltip>
          </div>

          <div className={cx("flex items-stretch")}>
            <Tooltip content="Rebuild" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconRebuildLarge }}
              />
            </Tooltip>
            <Tooltip content="VSCode" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconVSCode }}
              />
            </Tooltip>

            <Tooltip content="Deploy" asChild>
              <div
                className="btn transition-all flex items-center justify-center hover:bg-blue-600"
                dangerouslySetInnerHTML={{ __html: iconServer }}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-row items-stretch border-b">Tree</div>
        <EdItemTree />
      </div>
    </div>
  );
};
