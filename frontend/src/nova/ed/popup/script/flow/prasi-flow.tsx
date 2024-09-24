import { findNodeById } from "crdt/node/flatten-tree";
import { getActiveNode } from "crdt/node/get-node-by-id";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { useCallback, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { PrasiFlowEditor } from "./prasi-flow-editor";
import { PrasiFlowProp } from "./prasi-flow-prop";
import { PrasiFlowRunner } from "./prasi-flow-runner";
import { RPFlow } from "./runtime/types";
import { fg } from "./utils/flow-global";
import { defaultFlow } from "./utils/prasi/default-flow";
import { initAdv } from "./utils/prasi/init-adv";
import { current } from "immer";

export const EdPrasiFlow = function () {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});
  fg.render = local.render;
  const sflow = p.script.flow;
  const popup = p.ui.popup.script;
  const node = getActiveNode(p);
  const prasi = fg.prasi;

  const resetDefault = useCallback(
    (relayout: boolean) => {
      fg.updateNoDebounce(
        "Flow Reset",
        ({ node }) => {
          const new_flow = defaultFlow(
            "item",
            `item-${node.item.id}`,
            node.item.id
          );
          if (!node.item.adv) node.item.adv = {};
          node.item.adv.flow = new_flow;
        },
        ({ pflow }) => {
          localStorage.removeItem(`prasi-flow-vp-${`item-${node?.item.id}`}`);
          sflow.should_relayout = relayout;
          sflow.current = pflow || null;
          local.render();
        }
      );
    },
    [node?.item.id, fg.updateNoDebounce]
  );

  fg.prasi.resetDefault = resetDefault;

  useEffect(() => {
    const tree = getActiveTree(p);

    if (node && tree) {
      if (popup.prop_name === "" && popup.mode === "js") {
        if (node.item.id !== prasi.item_id) {
          initAdv(node, tree);
          prasi.item_id = node.item.id;
          fg.updateNoDebounce = (
            action_name: string,
            fn,
            next?: (arg: { pflow?: RPFlow | null }) => void
          ) => {
            tree.update(
              action_name,
              ({ findNode }) => {
                const node = findNode(active.item_id);

                if (node) {
                  if (!node.item.adv) {
                    node.item.adv = {};
                  }

                  if (!node.item.adv?.flow) {
                    node.item.adv.flow = defaultFlow(
                      "item",
                      `item-${node.item.id}`,
                      node.item.id
                    );
                  }

                  if (node.item.adv?.flow) {
                    fn({ pflow: node.item.adv.flow, node });
                  }
                }
              },
              ({ findNode }) => {
                const n = findNode(node.item.id);

                if (next) {
                  next({ pflow: n?.item.adv?.flow });
                } else {
                  sflow.current = n?.item.adv?.flow || null;
                }
              }
            );
          };
          fg.update = (
            action_name: string,
            fn,
            next?: (arg: { pflow?: RPFlow | null }) => void
          ) => {
            clearTimeout(fg.update_timeout);
            fg.update_timeout = setTimeout(() => {
              fg.updateNoDebounce(action_name, fn, next);
            }, 100);
          };

          if (
            !node.item.adv?.flow ||
            (node.item.adv?.flow &&
              !Object.values(node.item.adv.flow.nodes).find(
                (e) => e.type === "start"
              ))
          ) {
            resetDefault(true);
            return;
          }
        }

        if (node.item.adv?.flow) {
          sflow.current = node.item.adv.flow;
          local.render();
        }
      }
    }
  }, [node?.item.id, sflow.current, prasi.updated_outside, node]);

  if (!sflow.current) return null;

  return (
    <>
      <PanelGroup direction="horizontal" className="select-none">
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <PrasiFlowEditor
                resetDefault={resetDefault}
                pflow={sflow.current}
                should_relayout={sflow.should_relayout}
              />
            </Panel>

            <PanelResizeHandle className={"border-t"} />
            <Panel
              defaultSize={
                Number(localStorage.getItem("prasi-flow-panel-v")) || 25
              }
              className={css`
                min-height: 40px;
              `}
              onResize={(size) => {
                localStorage.setItem("prasi-flow-panel-v", size + "");
              }}
            >
              <PrasiFlowRunner pflow={sflow.current} />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className={"border-l"} />
        <Panel
          defaultSize={Number(localStorage.getItem("prasi-flow-panel-h")) || 15}
          onResize={(size) => {
            localStorage.setItem("prasi-flow-panel-h", size + "");
          }}
          className={css`
            min-width: 250px;
          `}
        >
          <PrasiFlowProp pflow={sflow.current} />
        </Panel>
      </PanelGroup>
    </>
  );
};
