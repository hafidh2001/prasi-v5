import { createIds, createManyNodes } from "popup/flow/runtime/lib/create-node";

export const defaultEventFlow = (type: string) => {
  const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

  const nodes = createManyNodes({
    [a]: {
      type: "start",
    },
  });

  return {
    id: a,
    name: type,
    nodes: nodes,
    flow: {
      [a]: [a],
    },
  };
};
