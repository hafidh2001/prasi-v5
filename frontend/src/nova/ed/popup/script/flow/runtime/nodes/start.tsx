import { defineNode } from "../lib/define-node";

export const nodeStart = defineNode({
  type: "start",
  process: async ({ node, next, processBranch }) => {
    const branches: Promise<void>[] = [];
    if (node.current.branches) {
      for (const branch of node.current.branches) {
        branches.push(processBranch(branch));
      }
    }
    await Promise.all(branches);
    next();
  },
  on_before_connect({ node, is_new, pflow }) {
    if (is_new) {
      if (!node.branches) {
        node.branches = [];
        pflow.flow[node.id] = [node.id];
      }
      node.branches.push({ flow: [] });
    }
  },
  className: css`
    border: 1px soild green;
    background: #dfffe8;
  `,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>`,
});