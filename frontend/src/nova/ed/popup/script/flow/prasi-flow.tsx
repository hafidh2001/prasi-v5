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
      setTimeout(() => {
        if (node) {
          fg.update("Flow Reset", ({ pflow }) => {
            console.log("asdas");
            const new_flow = defaultFlow(
              "item",
              `item-${node.item.id}`,
              node.item.id
            );
            for (const [k, v] of Object.entries(new_flow)) {
              (pflow as any)[k] = v;
            }
          });
          localStorage.removeItem(`prasi-flow-vp-${`item-${node.item.id}`}`);
          sflow.should_relayout = relayout;
          local.render();
        }
      });
    },
    [node?.item.id]
  );

  useEffect(() => {
    const tree = getActiveTree(p);

    if (node && tree) {
      if (popup.prop_name === "" && popup.mode === "js") {
        if (node.item.id !== prasi.item_id) {
          initAdv(node, tree);
          prasi.item_id = node.item.id;
          fg.update = (
            action_name: string,
            fn,
            next?: (arg: { pflow: RPFlow }) => void
          ) => {
            clearTimeout(fg.update_timeout);
            fg.update_timeout = setTimeout(() => {
              if (next) {
                const unwatch = tree.subscribe(() => {
                  unwatch();
                  const node = findNodeById(
                    active.item_id,
                    tree.snapshot.childs
                  );
                  if (node) {
                    if (node && node.item.adv && node.item.adv.flow) {
                      next({ pflow: node.item.adv.flow });
                    }
                  }
                });
              }
              tree.update(action_name, ({ findNode }) => {
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
                    fn({ pflow: node.item.adv.flow });
                  }
                }
              });
            }, 50);
            return node.item.adv?.flow as RPFlow;
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
