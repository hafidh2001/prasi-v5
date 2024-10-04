import { createIds, createManyNodes } from "../../runtime/lib/create-node";

export const defaultFlow = (type: "item", name: string, start_id: string) => {
  return {
    item() {
      const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

      const nodes = createManyNodes({
        [start_id]: {
          type: "start",
          branches: [
            { flow: [start_id, a], name: "Render" },
            { flow: [], name: "Effect" },
          ],
          jsx: true,
        },
        [a]: { type: "itemRender" },
      });

      return {
        id: start_id,
        name,
        nodes: nodes,
        flow: {
          [start_id]: [start_id],
        },
      };
    },
  }[type]();
};
