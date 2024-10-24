import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { FC, ReactNode } from "react";
import { CompPickerNode } from "./render-picker-node";
import { useLocal } from "utils/react/use-local";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";
import { compPickerToNodes } from "./to-nodes";
import { ChevronDown, ChevronRight } from "lucide-react";

export const RPNFolder: FC<{
  node: NodeModel<CompPickerNode>;
  prm: RenderParams;
  len: number;
}> = ({ node, prm, len }) => {
  const { onToggle } = prm;
  const local = useLocal({ renaming: node.id === "", rename_to: "" });
  const item = node.data;
  const p = useGlobal(EDGlobal, "EDITOR");
  if (!item || item.name === "__TRASH__" || p.ui.popup.comp.search.value)
    return <></>;

  const data = p.ui.popup.comp.data;
  let folder_item_count = 0;
  if (item.type === "folder") {
    folder_item_count = data.comps.filter(
      (e) => e.id_component_group === item.id
    ).length;
  }

  return (
    <div
      className={cx(
        "flex flex-col cursor-pointer",
        css`
          .btn {
            opacity: 0;
          }
          &:hover .btn {
            opacity: 1;
          }
        `,
        item.id === p.page.cur.id && `bg-blue-50`,
        item.type === "folder" &&
          "border-t pt-[10px] pb-[5px] hover:text-blue-600"
      )}
      onClick={(e) => {
        onToggle();
      }}
    >
      <div
        className={cx(
          "flex flex-1 mx-2 folder items-stretch bg-white",
          prm.isOpen && "folder-open"
        )}
      >
        <div className="px-2 border-r mr-2 flex items-center justify-center">
          {prm.isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </div>
        {local.renaming ? (
          <input
            value={local.rename_to}
            autoFocus
            spellCheck={false}
            onBlur={async () => {
              local.renaming = false;
              if (local.rename_to) {
                item.name = local.rename_to;
                local.render();
                if (item.id === "") {
                  if (item.name) {
                  }
                } else {
                  item.name = local.rename_to;
                  node.text = local.rename_to;
                  local.render();
                  p.render();
                  await _db.component_group.update({
                    where: { id: item.id },
                    data: { name: local.rename_to },
                  });
                }
              }
            }}
            className="border px-1 bg-white flex-1 outline-none mr-1 border-blue-500 "
            onChange={(e) => {
              local.rename_to = e.currentTarget.value;
              local.render();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                local.rename_to = item.name;
                local.render();
                e.currentTarget.blur();
              }
            }}
          />
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex items-center">
              <Name name={node.data?.name} />

              <div
                className="ml-1 p-1 border border-transparent hover:border-slate-400 bg-white rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  local.rename_to = item.name;
                  local.renaming = true;
                  local.render();
                }}
                dangerouslySetInnerHTML={{
                  __html: `<svg width="11" height="11" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 1C6.22386 1 6 1.22386 6 1.5C6 1.77614 6.22386 2 6.5 2C7.12671 2 7.45718 2.20028 7.65563 2.47812C7.8781 2.78957 8 3.28837 8 4V11C8 11.7116 7.8781 12.2104 7.65563 12.5219C7.45718 12.7997 7.12671 13 6.5 13C6.22386 13 6 13.2239 6 13.5C6 13.7761 6.22386 14 6.5 14C7.37329 14 8.04282 13.7003 8.46937 13.1031C8.47976 13.0886 8.48997 13.0739 8.5 13.0591C8.51003 13.0739 8.52024 13.0886 8.53063 13.1031C8.95718 13.7003 9.62671 14 10.5 14C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13C9.87329 13 9.54282 12.7997 9.34437 12.5219C9.1219 12.2104 9 11.7116 9 11V4C9 3.28837 9.1219 2.78957 9.34437 2.47812C9.54282 2.20028 9.87329 2 10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1C9.62671 1 8.95718 1.29972 8.53063 1.89688C8.52024 1.91143 8.51003 1.92611 8.5 1.9409C8.48997 1.92611 8.47976 1.91143 8.46937 1.89688C8.04282 1.29972 7.37329 1 6.5 1ZM14 5H11V4H14C14.5523 4 15 4.44772 15 5V10C15 10.5523 14.5523 11 14 11H11V10H14V5ZM6 4V5H1L1 10H6V11H1C0.447715 11 0 10.5523 0 10V5C0 4.44772 0.447715 4 1 4H6Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
                }}
              ></div>
              {folder_item_count === 0 && (
                <div
                  className="ml-1 p-1 border border-transparent hover:border-slate-400 bg-white rounded-sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm("Delete empty folder?")) {
                      await _db.component_group.delete({
                        where: { id: item.id },
                      });
                      data.groups = data.groups.filter((e) => e.id !== item.id);
                      compPickerToNodes(p);
                      p.render();
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
                  }}
                ></div>
              )}
            </div>
            <div className="text-xs pr-2 text-slate-400 flex items-center justify-between">
              <div>
                {len} {len > 1 ? "Components" : "Component"}
              </div>
              <div>{item.id}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Name: FC<{ name: ReactNode }> = ({ name }) => {
  if (typeof name !== "string") return name;
  if (name === "__TRASH__") return "Trash";

  if (name.startsWith("layout::")) {
    return (
      <div className="flex items-center">
        <div className="border border-green-600 text-green-600 mr-1 font-mono text-[10px] px-1 bg-white ">
          LAYOUT
        </div>
        <div>{name.substring("layout::".length)}</div>
      </div>
    );
  }

  return <div>{name}</div>;
};
