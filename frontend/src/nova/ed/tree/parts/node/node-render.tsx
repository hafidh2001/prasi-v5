import { NodeRender } from "@minoru/react-dnd-treeview";
import { useGlobal } from "../../../../../utils/react/use-global";
import { useLocal } from "../../../../../utils/react/use-local";
import { Tooltip } from "../../../../../utils/ui/tooltip";
import { active } from "../../../logic/active";
import { EDGlobal } from "../../../logic/ed-global";
import { PNode } from "../../../logic/types";
import { treeItemKeyMap } from "../key-map";
import { EdTreeNodeIndent } from "./node-indent";
import { EdTreeNodeName } from "./node-name";
import { parseNodeState } from "./node-tools";
import { EdTreeAction } from "./node-action";
import { updateNodeById } from "crdt/node/get-node-by-id";
import { EdTreeCtxMenu } from "../ctx-menu";

export const nodeRender: NodeRender<PNode> = (raw, render_params) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ right_click: null as any });
  if (!raw.data) return <></>;

  const node = raw.data;
  const item = node.item;

  const { is_active, is_component, is_hover } = parseNodeState({ item });

  return (
    <Tooltip
      placement="right"
      content={`ID: ${node.item.id}`}
      delay={0}
      asChild
    >
      <div
        tabIndex={0}
        onKeyDown={treeItemKeyMap(p, render_params, item)}
        onContextMenu={(event) => {
          event.preventDefault();
          local.right_click = event;
          local.render();
        }}
        onFocus={(e) => {
          active.item_id = item.id;
          p.render();
        }}
        onMouseEnter={() => {
          active.hover.id = item.id;
          p.render();
        }}
        onClick={() => {
          active.item_id = item.id;

          p.render();
        }}
        className={cx(
          "tree-item",
          `tree-${item.id}`,
          "relative border-b flex items-stretch outline-none min-h-[26px]",
          render_params.hasChild && "has-child",
          css`
            &:hover {
              .action-script {
                opacity: 0.6;
              }
            }
          `,

          is_active
            ? cx(
                "bg-blue-500 text-white",
                css`
                  .node-action {
                    color: black;
                    background: white;
                  }
                  input {
                    background: white;
                    color: black;
                  }
                `
              )
            : [is_component && `bg-purple-50`],
          is_hover && [
            (item as any).type === "section" ? "bg-blue-100" : "bg-blue-50",
          ]
        )}
      >
        {is_hover && (item as any).type !== "section" && (
          <div
            className={cx("absolute left-0 bottom-0 top-0 w-[4px] bg-blue-300")}
          ></div>
        )}
        {is_hover && (item as any).type !== "section" && (
          <div
            className={cx("absolute left-0 bottom-0 top-0 w-[4px] bg-blue-500")}
          ></div>
        )}

        {local.right_click && (
          <EdTreeCtxMenu
            raw={raw}
            event={local.right_click}
            onClose={() => {
              local.right_click = null;
              local.render();
            }}
          />
        )}
        <EdTreeNodeIndent raw={raw} render_params={render_params} />
        <EdTreeNodeName raw={raw} render_params={render_params} />
        <EdTreeAction raw={raw} render_params={render_params} />
      </div>
    </Tooltip>
  );
};
