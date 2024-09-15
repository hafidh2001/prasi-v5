import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PrasiFlowEditor } from "./prasi-flow-editor";
import { PrasiFlowProp } from "./prasi-flow-prop";
import { PrasiFlowRunner } from "./prasi-flow-runner";

export const PrasiFlow = () => {
  return (
    <PanelGroup direction="horizontal" className="select-none">
      <Panel>
        <PanelGroup direction="vertical">
          <Panel>
            <PrasiFlowEditor />
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
            <PrasiFlowRunner />
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
        <PrasiFlowProp />
      </Panel>
    </PanelGroup>
  );
};
