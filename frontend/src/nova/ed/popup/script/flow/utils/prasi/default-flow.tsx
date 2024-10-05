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
          position: {
            x: 37,
            y: 0,
          },
        },
        [a]: {
          type: "reactOutput",
          branches: [{ name: "children", flow: [a, b], mode: "sync-only" }],
          position: {
            x: 0,
            y: 80,
          },
        },
        [b]: {
          type: "code",
          source_code: "children",
          _codeBuild: { source_code: "children" },
          _codeError: {},
          position: {
            x: 1,
            y: 162,
          },
        },
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
