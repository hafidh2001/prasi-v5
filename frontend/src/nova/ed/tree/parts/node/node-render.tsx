import { NodeRender } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useGlobal } from "../../../../../utils/react/use-global";
import { useLocal } from "../../../../../utils/react/use-local";
import { Tooltip } from "../../../../../utils/ui/tooltip";
import { activateItem, active } from "../../../logic/active";
import { EDGlobal } from "../../../logic/ed-global";
import { PNode } from "../../../logic/types";
import { EdTreeCtxMenu } from "../ctx-menu";
import { treeItemKeyMap } from "../key-map";
import { EdTreeAction } from "./node-action";
import { EdTreeNodeIndent } from "./node-indent";
import { EdTreeNodeName } from "./node-name";
import { parseNodeState } from "./node-tools";

export const nodeRender: NodeRender<PNode> = (raw, render_params) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    right_click: null as any,
    expand_timeout: null as any,
  });

  useEffect(() => {
    if (render_params.isDropTarget && raw.data?.item?.id) {
      clearTimeout(local.expand_timeout);
      local.expand_timeout = setTimeout(() => {
        const open = JSON.parse(
          localStorage.getItem("prasi-tree-open") || "{}"
        );
        const should_open = open[active.comp?.id || p.page.cur?.id || ""] || [];
        if (p.ui.tree.ref) {
          p.ui.tree.ref.open([...should_open, raw.data?.item?.id]);
          p.render();
        }
      }, 500);
    }
  }, [render_params.isDropTarget]);

  if (!raw.data) {
    return <></>;
  }

  const node = raw.data;
  const item = node.item;
  if (!item) {
    return <></>;
  }

  const { is_active, is_component, is_hover } = parseNodeState({ item });

  return (
    <Tooltip
      placement="right"
      open={p.ui.tree.prevent_tooltip === true ? false : undefined}
      content={
        <>
          {item.component?.id &&
            p.comp.loaded[item.component.id]?.content_tree.name && (
              <>
                Component:{" "}
                <span className="font-bold underline">
                  {p.comp.loaded[item.component.id]?.content_tree.name}
                </span>
                <br />
              </>
            )}
          ID: {node.item.id}
        </>
      }
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
          p.ui.tree.prevent_tooltip = false;
          activateItem(p, item.id);
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
                  .node-text {
                    color: white;
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
          ],
          render_params.isDropTarget &&
            cx(
              "bg-blue-400 text-white",
              css`
                .node-action {
                  color: black;
                  background: white;
                }
                .node-text {
                  color: white;
                }
                .node-indent {
                  opacity: 0;
                }
                input {
                  background: white;
                  color: black;
                }
              `
            )
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
        {p.ui.comp.creating_id !== item.id &&
          p.ui.comp.loading_id !== item.id && (
            <EdTreeAction raw={raw} render_params={render_params} />
          )}
      </div>
    </Tooltip>
  );
};
