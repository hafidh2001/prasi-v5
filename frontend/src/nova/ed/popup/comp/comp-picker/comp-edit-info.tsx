import { FC } from "react";
import { CompPickerNode } from "./render-picker-node";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { Trash } from "lucide-react";

export const EdCompEditInfo: FC<{
  node: NodeModel<CompPickerNode>;
  close: () => void;
}> = ({ node, close }) => {
  const item = node.data;
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
