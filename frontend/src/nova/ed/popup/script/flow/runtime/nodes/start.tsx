import { defineNode } from "../lib/define-node";
import { PFNodeBranch } from "../types";

export const nodeStart = defineNode({
  type: "start",
  has_branches: true,
  process: async ({ runtime: runtime, next, processBranch, state }) => {
    const node = runtime.node;
    if (node.jsx) {
      const render = node.branches?.find((e) => e.name === "Render");
      state.react = {
        async render() {
          if (this.status === "rendered") {
            this.status = "rendering";
            if (render) await processBranch(render);
          }
        },
        async effects() {
          await Promise.all(
            node.branches
              ?.filter((e) => e.name !== "Render")
              .map((e) => processBranch(e)) || []
          );
        },
        status: "init",
      };

      if (render) processBranch(render);
    } else {
      const branches: Promise<void>[] = [];
      if (runtime.node.branches) {
        for (const branch of runtime.node.branches) {
          branches.push(processBranch(branch));
        }
      }

      await Promise.all(branches);
    }
    next();
  },
  default: { jsx: false },
  render_edge_label: ({ node, branch }) => {
    return (
      <div>
        {branch?.name === "Effect" ? (
          <div className="text-center leading-3">
            Effect
            <br />
            <div className="text-[80%]">After Render</div>
          </div>
        ) : (
          "Render"
        )}
      </div>
    );
  },
  on_before_connect({ node, is_new, pflow }) {
    if (is_new) {
      if (!node.branches) {
        node.branches = [];
        pflow.flow[node.id] = [node.id];
      }

      const new_branch: PFNodeBranch = { flow: [node.id], name: "" };
      if (node.jsx) {
        if (node.branches.find((e) => e.name === "Render")) {
          new_branch.name = "Effect";
          new_branch.mode = "async-only";
        } else {
          new_branch.name = "Render";
          new_branch.mode = "sync-only";
        }
      }

      node.branches.push(new_branch);
    }
  },
  className: css`
    border: 1px soild green;
    background: #dfffe8;
  `,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>`,
});
