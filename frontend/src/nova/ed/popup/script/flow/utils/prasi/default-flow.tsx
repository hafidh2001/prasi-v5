import { createIds, createManyNodes } from "../../runtime/lib/create-node";

export const defaultFlow = (type: "item", name: string, start_id: string) => {
  return {
    item() {
      const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

      const nodes = createManyNodes({
        [start_id]: {
          type: "start",
          branches: [
            { flow: [start_id, a], name: "Render", mode: "sync-only" },
          ],
          jsx: true,
        },
        [a]: { type: "reactOutput" },
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
