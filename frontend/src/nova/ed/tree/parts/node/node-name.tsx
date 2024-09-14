import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { RectangleEllipsis } from "lucide-react";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { LoadingSpinner } from "utils/ui/loading";
import { PNode } from "../../../logic/types";
import { scrollTreeActiveItem } from "../scroll-tree";
import { ComponentIcon } from "./node-indent";
import capitalize from "lodash.capitalize";
import startCase from "lodash.startcase";

export const EdTreeNodeName: FC<{
  raw: NodeModel<PNode>;
  render_params: RenderParams;
}> = ({ raw, render_params }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ rename: raw.data?.item.name || "" });
  const node = raw.data;
  if (!node) return null;
  const item = node.item;
  const isRenaming = p.ui.tree.rename_id === item.id;

  return (
    <div className="text-[14px] relative flex flex-col justify-center cursor-pointer flex-1">
      <div className="flex flex-col">
        {isRenaming ? (
          <input
            className={cx(
              "rename-item absolute inset-0 outline-none border border-blue-500 my-[2px] mr-[1px] px-1"
            )}
            autoFocus
            spellCheck={false}
            value={local.rename}
            onFocus={(e) => {
              if (node.parent?.component?.is_jsx_root) {
                p.ui.tree.rename_id = "";
                p.render();
              } else {
                e.currentTarget.select();
              }
            }}
            onBlur={() => {
              if (node.parent?.component?.is_jsx_root) {
                return;
              }
              getActiveTree(p).update(({ findNode }) => {
                const n = findNode(node?.item.id);
                if (n) {
                  n.item.name = local.rename || "";

                  if (
                    !n.item.name &&
                    n.item.component?.id &&
                    p.comp.loaded[n.item.component?.id].content_tree.name
                  ) {
                    n.item.name =
                      p.comp.loaded[n.item.component?.id].content_tree.name;
                  }
                }
              });

              p.ui.tree.rename_id = "";
              p.render();
              setTimeout(scrollTreeActiveItem);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" || e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            onChange={(e) => {
              local.rename = e.target.value
                .replace(/[^a-zA-Z0-9:]+/g, " ")
                .split(" ")
                .map((e) => (e[0] || "").toUpperCase() + e.slice(1))
                .join(" ");

              local.render();
            }}
          />
        ) : (
          <>
            {p.ui.comp.creating_id === node.item.id ? (
              <div className="flex items-center space-x-1">
                <LoadingSpinner size={12} />
                <div className="text-[12px]">Creating Component</div>
              </div>
            ) : p.ui.comp.loading_id === node.item.id ? (
              <div className="flex items-center space-x-1">
                <LoadingSpinner size={12} />
                <div className="text-[12px]">Editing Component</div>
              </div>
            ) : (
              <Name node={node} render_params={render_params} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Name: FC<{ node: PNode; render_params: RenderParams }> = ({
  node,
  render_params,
}) => {
  const name = node.item.name;

  let comp_label = "";

  if (node?.item.component?.id) {
    for (const prop of Object.values(node?.item.component?.props || {})) {
      if (prop.is_name) {
        try {
          eval(`comp_label = ${prop.valueBuilt}`);
        } catch (e) {}
        if (typeof comp_label !== "string" && typeof comp_label !== "number") {
          comp_label = "";
        }
      }
    }
  }

  if (node.parent?.component?.is_jsx_root) {
    return (
      <div className={cx("flex items-center space-x-1 pr-1")}>
        <RectangleEllipsis size={12} className="node-text text-purple-500" />
        <div className="flex-1 relative self-stretch">
          <div className="absolute inset-0 flex items-center">
            <div className="truncate text-ellipsis">
              {name + (comp_label ? `: ${comp_label}` : "")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (typeof name === "string" && name.startsWith("jsx:")) {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex bg-white text-purple-500 space-x-[2px] border-r pr-1 items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html: `<svg width="9px" height="9px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
            }}
          ></div>
          <div className="font-mono text-[8px]">JSX</div>
        </div>
        <div>{name.substring(4)}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {node.item.component?.id && render_params.hasChild && (
        <div className="node-text text-purple-600 mt-[1px]">
          <ComponentIcon />
        </div>
      )}
      <div>
        {name
          .replace(/[^a-zA-Z0-9:]+/g, " ")
          .split(" ")
          .map((e) => (e[0] || "").toUpperCase() + e.slice(1))
          .join(" ")}
        {comp_label && `: ${comp_label}`}
      </div>
    </div>
  );
};
