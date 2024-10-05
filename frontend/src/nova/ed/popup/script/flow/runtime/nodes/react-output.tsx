import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeReactOutput = defineNode({
  type: "react.output",
  has_branches: true,
  fields: {
    class_name: { idx: 0, type: "string", label: "CSS Class" },
  },
  is_async: false,
  process: async ({ next, runtime, processBranch, state }) => {
    next();

    const react = state.react;
    if (react) {
      if (runtime.node.branches) {
        const children = runtime.node.branches.find(
          (e) => e.name === "children"
        );

        if (react.status === "rendering") react.status = "rendered";
        if (children) await processBranch(children);
      }

      if (react.status === "init") {
        react.status = "rendered";
        await react.effects();
      }
    }
  },

  className: css`
    border: 2px solid purple !important;
  `,
  node_picker(def) {
    if (["react.output", "react.render"].includes(def.type))
      return { hidden: true };
  },
  on_before_connect({ node, is_new }) {
    if (node.branches) {
      const children = node.branches.find((e) => e.name === "children");
      if (!children) {
        node.branches.push({
          flow: [node.id],
          name: "children",
          mode: "sync-only",
        });
      } else if (is_new) {
        node.branches.push({
          flow: [node.id],
          name: "event",
        });
      }
    }
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>`,
});
