import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeReactRender = defineNode({
  type: "react.re-render",
  fields: {
    class_name: { idx: 0, type: "string", label: "CSS Class" },
  },
  has_branches: false,
  is_async: true,
  width: 160,
  className: css`
    border: 1px solid purple;
  `,
  process: async ({ next, runtime: node, vars, state }) => {
    next();
    const react = state.react;
    if (react) {
      await react.render();
    }
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart"><path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>`,
});
