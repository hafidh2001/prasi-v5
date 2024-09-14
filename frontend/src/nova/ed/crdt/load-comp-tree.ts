import { NodeModel } from "@minoru/react-dnd-treeview";
import { PNode } from "../logic/types";
import { PG } from "../logic/ed-global";
import { createClient } from "../../../utils/sync/client";

export const loadCompTree = async (
  sync: ReturnType<typeof createClient>,
  comp_id: string
) => {
  sync.comp;

  const component = {
    status: "ready" as "ready" | "editing",
    nodes: {
      models: [] as NodeModel<PNode>[],
      map: {} as Record<string, PNode>,
      array: [] as PNode[],
    },
    update() {},
  };
  return component;
};
