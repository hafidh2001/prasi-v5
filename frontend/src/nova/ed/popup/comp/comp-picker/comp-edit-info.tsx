import { FC } from "react";
import { CompPickerNode } from "./render-picker-node";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { Trash } from "lucide-react";
import { useLocal } from "utils/react/use-local";
import { loadCompTree } from "crdt/load-comp-tree";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";

export const EdCompEditInfo: FC<{
  node: NodeModel<CompPickerNode>;
  close: () => void;
}> = ({ node, close }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const item = node.data;
  const local = useLocal({ name: item?.name });
  return (
    <div
      className={cx(
        "flex flex-col min-w-[300px]",
        css`
          .field {
            display: flex;
            border-bottom: 1px solid #ccc;
            .input,
            .label {
              padding: 3px 6px;
              display: flex;
            }
            .label {
              border-right: 1px solid #ccc;
              width: 70px;
              align-items: center;
            }
            .input {
              flex: 1;
              display: flex;
              align-items: center;
            }
          }
        `
      )}
    >
      <div className="field">
        <div className="label">Name</div>
        <input
          className="input"
          value={local.name}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          autoFocus
          onFocus={(e) => {
            e.currentTarget.select();
          }}
          onBlur={async () => {
            if (local.name && item && local.name !== item?.name) {
              if (confirm(`Rename ${item.name} ~> ` + local.name) && p.sync) {
                const tree = await loadCompTree({
                  p,
                  id: item.id,
                  activate: false,
                });
                tree.update(
                  "Rename Component",
                  ({ tree }) => {
                    if (local.name) {
                      tree.name = local.name;
                    }
                  },
                  () => {
                    if (local.name) {
                      node.text = local.name;
                      item.name = local.name;
                      const loaded = p.comp.loaded[item.id];
                      if (loaded) {
                        loaded.content_tree.name = item.name;
                      }
                      close();
                      p.render();
                    }
                  }
                );
              } else {
                local.name = item.name;
                local.render();
              }
            }
          }}
          onChange={(e) => {
            const name = e.currentTarget.value;
            local.name = name;
            local.render();
          }}
        />
      </div>
      <div className="field">
        <div className="label">Image</div>
        <div className="input">
          <input
            type="file"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file && item) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async () => {
                  const buf = reader.result as ArrayBuffer;
                  if (buf.byteLength > 100_000) {
                    alert("Image size should be less than 100KB");
                  } else {
                    item.ext = false;
                    item.render?.();
                    await fetch("/comp_img/" + item.id, {
                      method: "POST",
                      body: buf,
                    });

                    item.ext = true;
                    item.render?.();
                  }
                };
              }
            }}
            accept="image/png"
          />
          {item && item.ext && (
            <div
              className="text-red-600 cursor-pointer"
              onClick={() => {
                if (
                  item &&
                  confirm("Are you sure you want to delete the image?")
                ) {
                  fetch("/comp_ext/" + item.id + "/reset");
                  item.ext = false;
                  item.render?.();
                  close();
                }
              }}
            >
              <Trash size="16" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
