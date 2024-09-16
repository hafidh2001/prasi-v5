import { getActiveNode } from "crdt/node/get-node-by-id";
import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { PrasiFlowEditor } from "./prasi-flow-editor";
import { PrasiFlowProp } from "./prasi-flow-prop";
import { PrasiFlowRunner } from "./prasi-flow-runner";
import { fg } from "./utils/flow-global";
import { initAdv } from "./utils/prasi/init-adv";
import { defaultFlow } from "./utils/prasi/default-flow";

export const PrasiFlow = function () {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({});
  fg.render = local.render;

  const popup = p.ui.popup.script;
  const tree = getActiveTree(p);
  const node = getActiveNode(p);
  const sflow = p.script.flow;

  if (node && tree && popup.prop_name === "" && popup.mode === "js") {
    initAdv(node, tree);

    if (!node.item.adv?.flow) {
      if (!sflow.current || sflow.current.id !== node.item.id) {
        sflow.current = null;
        setTimeout(() => {
          sflow.current = defaultFlow("item", node.item.id);
          local.render();
        });
      }
    }
  }

  if (!sflow.current) return null;

  return (
    <>
      <PanelGroup direction="horizontal" className="select-none">
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <PrasiFlowEditor pflow={sflow.current} />
            </Panel>

            <PanelResizeHandle className={"border-t"} />
            <Panel
              defaultSize={
                Number(localStorage.getItem("prasi-flow-panel-v")) || 25
              }
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
