import { createIds, createManyNodes } from "../../runtime/lib/create-node";

export const defaultFlow = (type: "item", start_id: string) => {
  return {
    item() {
      const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

      const nodes = createManyNodes({
        [start_id]: { type: "start" },
      });

      return {
        id: start_id,
        name: "item-flow",
        nodes: nodes,
        flow: {
          [start_id]: [start_id],
        },
      };
    },
  }[type]();
};
