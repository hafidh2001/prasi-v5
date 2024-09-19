import { Viewport } from "@xyflow/react";
import { RPFlow } from "../runtime/types";

export const restoreViewport = ({
  pflow,
  local,
}: {
  pflow: RPFlow;
  local: { viewport?: Viewport; reactflow: any };
}) => {
  let viewport = undefined as undefined | Viewport;

  try {
    viewport = JSON.parse(
      localStorage.getItem(`prasi-flow-vp-${pflow.name}`) || "undefined"
    );
  } catch (e) {}
  local.viewport = viewport;
  if (!local.viewport) {
    const ival = setInterval(() => {
      const ref = local.reactflow;
      if (ref) {
        ref.fitView();
        clearInterval(ival);
      }
    }, 10);
  }
};
