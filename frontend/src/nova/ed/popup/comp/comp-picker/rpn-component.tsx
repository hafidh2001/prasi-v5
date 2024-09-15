import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { EDGlobal } from "logic/ed-global";
import { FC, ReactNode } from "react";
import { useGlobal } from "utils/react/use-global";
import { CompPickerNode } from "./render-picker-node";
import tc from "tinycolor2";
import { compPickerToNodes } from "./to-nodes";

export const RPNComponent: FC<{
  node: NodeModel<CompPickerNode>;
  prm: RenderParams;
}> = ({ node }) => {
  const item = node.data;
  const p = useGlobal(EDGlobal, "EDITOR");
  if (!item) return <></>;
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

  const delComponent = async (comp_id: string) => {
    if (isTrashed) {
      if (confirm("Permanently delete this component?")) {
        // await _db.component.delete({
        //   where: { id: comp_id },
        // });
        // await reloadCompPicker(p);
        p.render();
      }
    } else if (trash_folder) {
      if (confirm("Move component to trash?")) {
        const found = data.comps.find((e) => e.id === item.id);
        if (found) {
          await _db.component.update({
            where: { id: comp_id },
            data: { id_component_group: trash_folder.id },
            select: {},
          });
          found.id_component_group = trash_folder.id;
          node.parent = trash_folder.id;
          compPickerToNodes(p);
          p.render();
        }
      }
    }
  };

  return (
    <div
      className={cx(
        "flex flex-col hover:bg-blue-50 cursor-pointer",
        css`
          .btn {
            opacity: 0;
          }
          &:hover .btn {
            opacity: 1;
          }
        `,
        item.id === p.page.cur.id && `bg-blue-50`,
        item.type === "comp" && "my-1 ml-2 mr-0 border flex-1",
        item.type === "comp" &&
          css`
            min-width: 190px;
          `
      )}
      onClick={(e) => {}}
    >
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
        <div
          className={cx(
            "transition-all bg-white flex items-center px-1 hover:border-blue-300 hover:bg-blue-100 opacity-20 hover:opacity-100",
            css`
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
            delComponent(item.id);
          }}
        >
          <div className="normal">
            <DeleteIcon />
          </div>
          <div className="over hidden text-red-600">
            <DeleteIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const Name: FC<{ id: string; name: string; onClick: () => void }> = ({
  id,
  name,
  onClick,
}) => {
  const bg = colorize(name);
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
      <div>{name.split("_").join(" ")}</div>
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
