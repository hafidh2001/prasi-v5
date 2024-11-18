import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { EDGlobal } from "logic/ed-global";
import { Check } from "lucide-react";
import { FC } from "react";
import tc from "tinycolor2";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { formatItemName } from "../../../tree/parts/node/node-name";
import { CompPickerNode } from "./render-picker-node";

export const RPNComponent: FC<{
  node: NodeModel<CompPickerNode>;
  prm: RenderParams;
  checked: boolean;
  onCheck: (item_id: string) => void;
  onRightClick: (arg: {
    event: React.MouseEvent<HTMLElement, MouseEvent>;
    comp_id: string;
  }) => void;
}> = ({ node, checked, onCheck, onRightClick }) => {
  const item = node.data;
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});
  if (!item) return <></>;
  item.render = local.render;

  const popup = p.ui.popup.comp;
  const data = p.ui.popup.comp.data;
  let folder_item_count = 0;
  if (item.type === "folder") {
    folder_item_count = data.comps.filter(
      (e) => e.id_component_group === item.id
    ).length;
  }

  const trash_folder = data.groups.find((e) => e.name === "__TRASH__");
  const isTrashed = node.parent === trash_folder?.id;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick({ event: e, comp_id: item.id });
      }}
      className={cx(
        "flex flex-col bg-white hover:bg-blue-50 cursor-pointer ",
        css`
          .btn {
            opacity: 0;
          }
          &:hover .btn {
            opacity: 1;
          }

          &:hover {
            outline: 1px solid #1f9cf0;
            border: 1px solid #1f9cf0;
          }
        `,
        item.id === p.page.cur.id && `bg-blue-50`,
        item.type === "comp" && "my-1 ml-2 mr-0 border transition-all flex-1",
        checked && "outline outline-2 outline-red-600",
        item.type === "comp" &&
          css`
            min-width: 190px;
          `
      )}
      onClick={(e) => {}}
    >
      {item.ext && (
        <img
          onClick={() => {
            if (popup.on_pick) {
              popup.on_pick(item.id);
              popup.on_pick = null;
              p.render();
            }
          }}
          src={`/comp_img/${item.id}`}
          className="h-[100px] bg-white"
        />
      )}
      <div className={cx("flex items-stretch")}>
        <Name
          name={item.name}
          id={item.id}
          onClick={() => {
            if (popup.on_pick) {
              popup.on_pick(item.id);
              popup.on_pick = null;
              p.render();
            }
          }}
        />
        {!isTrashed && (
          <div
            className={cx(
              "transition-all flex justify-center items-center",
              checked
                ? "bg-red-600 text-white"
                : "bg-white border-[4px] border-[#ccc] opacity-20 hover:opacity-100 hover:border-red-300 hover:bg-red-100 ",
              css`
                width: 25px;
                &:hover {
                  .normal {
                    display: none;
                  }
                  .over {
                    display: block;
                  }
                }
              `
            )}
            onClick={async (e) => {
              e.stopPropagation();
              onCheck(item.id);
              p.render();
            }}
          >
            {checked && <Check size={13} />}
          </div>
        )}
      </div>
    </div>
  );
};

const Name: FC<{ id: string; name: string; onClick: () => void }> = ({
  id,
  name,
  onClick,
}) => {
  const bg = colorize(name + id.substring(0, 2));
  const fg = tc(bg);
  return (
    <div
      onClick={onClick}
      className={cx(
        "capitalize flex-1 text-center flex-col flex items-center justify-center font-black",
        css`
          background-color: ${bg};
          opacity: 0.8;
          color: ${fg.isDark() ? "white" : "black"};
        `
      )}
    >
      <div>{formatItemName(name)}</div>
      <div className={"text-[8px] opacity-70"}>{id}</div>
    </div>
  );
};

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.5 1a.5.5 0 000 1h4a.5.5 0 000-1h-4zM3 3.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H11v8a1 1 0 01-1 1H5a1 1 0 01-1-1V4h-.5a.5.5 0 01-.5-.5zM5 4h5v8H5V4z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const colorize = (str: string) => {
  let hash = 0;
  if (str.length === 0) return "";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};
