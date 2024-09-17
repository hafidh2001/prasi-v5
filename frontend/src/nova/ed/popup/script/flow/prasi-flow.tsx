import { getActiveNode } from "crdt/node/get-node-by-id";
import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { deepClone, useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { PrasiFlowEditor } from "./prasi-flow-editor";
import { PrasiFlowProp } from "./prasi-flow-prop";
import { PrasiFlowRunner } from "./prasi-flow-runner";
import { fg } from "./utils/flow-global";
import { initAdv } from "./utils/prasi/init-adv";
import { defaultFlow } from "./utils/prasi/default-flow";
import { useCallback, useEffect } from "react";

export const PrasiFlow = function () {
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
          sflow.current = defaultFlow(
            "item",
            `item-${node.item.id}`,
            node.item.id
          );
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
          if (sflow.current !== null && sflow.current.id !== node.item.id) {
            sflow.current = null;
            local.render();
          } else {
            initAdv(node, tree);
            prasi.item_id = node.item.id;
            fg.update.execute = (then) => {
              if (prasi.skip_init_update) {
                prasi.skip_init_update = false;
                return;
              }
              clearTimeout(fg.update.timeout);
              fg.update.timeout = setTimeout(() => {
                getActiveTree(p).update(
                  fg.update.action
                    ? "Item Flow: " + fg.update.action
                    : "Item Flow: Update",
                  ({ findNode }) => {
                    const node = findNode(prasi.item_id);
                    if (node && node.item.adv && sflow.current) {
                      node.item.adv.flow = deepClone(sflow.current);
                    }
                  }
                );
                fg.update.action = "";
              }, 300);
            };

            let should_reset = false;
            if (!node.item.adv?.flow) {
              if (!sflow.current || sflow.current.id !== node.item.id) {
                should_reset = true;
              }
            } else if (Object.keys(node.item.adv.flow.flow).length === 0) {
              should_reset = true;
            }

            if (should_reset) {
              sflow.current = null;
              resetDefault(true);
            }

            if (node.item.adv?.flow) {
              sflow.current = deepClone(node.item.adv.flow);
            }
          }
        }

        if (prasi.updated_outside && node.item.adv?.flow && sflow.current) {
          prasi.updated_outside = false;
          sflow.current = deepClone(node.item.adv.flow);
          sflow.ts = Date.now();
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
                ts={sflow.ts}
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
