import { current } from "immer";
import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";
import { PFNode, PFNodeBranch } from "../types";

type Condition = { condition: string; name: string };

export const nodeBranch = defineNode({
  type: "branch",
  on_before_connect: ({ node, is_new }) => {
    if (!node.conditions) node.conditions = [];
    if (!node.branches) node.branches = [];

    const branches = node.branches as PFNodeBranch[];
    const conditions = node.conditions as Condition[];

    if (conditions.length === branches.length) {
      let empty_branch_len = branches.filter(
        (e) => !e.flow || (e.flow && e.flow.length === 0)
      ).length;

      if (empty_branch_len === 0 || conditions.length === 0) {
        const name = "Condition " + (conditions.length + 1);
        conditions.push({ condition: "", name });
        branches.push({
          flow: [],
          idx: conditions.length - 1,
          name,
          meta: { condition_idx: branches.length },
        });
      }
    } else {
      if (conditions.length > branches.length) {
        for (const [i, c] of Object.entries(conditions)) {
          const idx = i as unknown as number;

          const branch = node.branches.find(
            (e) => e.meta?.condition_idx === idx
          );
          if (branch) {
            branch.idx = idx;
            branch.code = c.condition;
            branch.name = c.name;
          } else {
            node.branches.push({
              idx,
              code: c.condition,
              name: c.name,
              flow: [],
              meta: {
                condition_idx: idx,
              },
            });
          }
        }
      }
    }
  },
  fields_changed({ node }) {
    if (!node.branches) node.branches = [];
    const conditions = node.conditions as Condition[];

    node.branches = node.branches.filter((e, idx) => {
      const found = conditions.find(
        (c, idx) => idx + "" === e.meta?.condition_idx + ""
      );
      if (found) {
        e.name = found.name;
        return true;
      }
      return false;
    });
  },
  fields: {
    conditions: {
      label: "Conditions",
      type: "array",
      className: css`
        .array-item {
          border-bottom: 4px solid #e2e8f0;
        }
      `,
      fields: {
        condition: { type: "code", idx: 1 },
        name: { idx: 0, type: "string" },
      },
      del: {
        onChange: ({
          node,
          idx,
        }: {
          node: PFNode;
          list: any[];
          idx: number;
        }) => {
          if (!node.branches) {
            node.branches = [];
          }

          node.branches = current(node).branches!.filter((e) => {
            return e.meta?.condition_idx !== idx;
          });
        },
      },
    },
  },
  process: async ({ node, vars, processBranch, next }) => {
    const branches = [];
    if (node.current.branches) {
      for (const branch of node.current.branches) {
        if (branch.code) {
          const result = codeExec({
            code: `return ${branch.code}`,
            node,
            vars,
            console,
          });
          if (result) {
            branches.push(processBranch(branch));
            break;
          }
        } else {
          branches.push(processBranch(branch));
        }
      }
    }
    await Promise.all(branches);
    next();
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-split"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>`,
});
