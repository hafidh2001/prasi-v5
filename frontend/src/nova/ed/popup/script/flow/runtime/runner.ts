import { allNodeDefinitions } from "./nodes";
import {
  DeepReadonly,
  PFNode,
  PFNodeBranch,
  PFNodeDefinition,
  PFRuntime,
  RPFlow,
} from "./types";

type RunFlowOpt = {
  vars?: Record<string, any>;
  capture_console: boolean;
  delay?: number;
  after_node?: (arg: {
    visited: PFRunVisited[];
    node: DeepReadonly<PFNode>;
  }) => void;
  before_node?: (arg: {
    visited: PFRunVisited[];
    node: DeepReadonly<PFNode>;
  }) => void;
};
export const runFlow = async (pf: RPFlow, opt?: RunFlowOpt) => {
  const main_flow_id = Object.keys(pf.flow).find(
    (id) => pf.nodes[id].type === "start"
  );
  if (main_flow_id) {
    const runtime: PFRuntime = {
      nodes: pf.flow[main_flow_id].map((id) => pf.nodes[id]),
    };
    const result = await flowRuntime(pf, runtime, opt);
    return { status: "ok", visited: result.visited, vars: result.vars };
  }

  return { status: "error", reason: "Main Flow Not Found" };
};

export type PFRunResult = Awaited<ReturnType<typeof runFlow>>;
type PFRunVisited = {
  node: DeepReadonly<PFNode>;
  parent_branch?: PFNodeBranch;
  log: any[];
  branching?: boolean;
  tstamp: number;
  error: any;
};

const flowRuntime = async (
  pf: RPFlow,
  runtime: PFRuntime,
  opt?: RunFlowOpt
) => {
  const visited: PFRunVisited[] = [];
  const vars = { ...opt?.vars };

  // Global execution count initialized here
  const executionCount = new Map<string, number>(); // Track execution counts globally

  const state = {};
  for (const current of runtime.nodes) {
    if (
      !(await runSingleNode({
        pf,
        current,
        visited,
        vars,
        opt,
        state,
        executionCount,
      }))
    ) {
      break;
    }
  }
  return { visited, vars };
};

const runSingleNode = async (arg: {
  pf: RPFlow;
  current: DeepReadonly<PFNode>;
  branch?: PFNodeBranch;
  visited: PFRunVisited[];
  vars: Record<string, any>;
  state: any;
  opt?: RunFlowOpt;
  executionCount: Map<string, number>;
}) => {
  const { pf, visited, vars, current, branch, opt, executionCount, state } =
    arg;
  const { capture_console, after_node, before_node } = opt || {};
  const def = (allNodeDefinitions as any)[
    current.type
  ] as PFNodeDefinition<any>;

  if (before_node) {
    before_node({ visited: visited, node: current });
  }

  const run_visit: PFRunVisited = {
    node: current,
    parent_branch: branch,
    log: [] as any[],
    tstamp: Date.now(),
    branching: false,
    error: null,
  };
  visited.push(run_visit);

  if (current.vars) {
    Object.assign(vars, current.vars);
  }

  try {
    const execute_node = await new Promise<PFNodeBranch | void>(
      async (resolve, reject) => {
        if (current.branches) {
          run_visit.branching = true;

          if (after_node) {
            after_node({ visited: visited, node: current });
          }
        }

        try {
          await def.process({
            vars,
            state,
            runtime: {
              node: current,
              first: visited[0].node,
              prev: visited[visited.length - 1].node,
              visited,
            },
            processBranch: async (branch) => {
              // Delay execution if the node has branches
              if (opt?.delay) {
                await new Promise((done) => setTimeout(done, opt.delay));
              }

              for (const id of branch.flow) {
                if (current.id === id) continue; // Prevent re-visiting the current node

                // Increment the execution count for this node across all branches
                const currentCount = executionCount.get(id) || 0;
                executionCount.set(id, currentCount + 1); // Update the count

                // Log if a node is executed more than once
                if (currentCount + 1 > 1) {
                  console.warn(
                    `Node [${pf.nodes[id].type}] '${id}' executed multiple times: ${currentCount + 1} times.`
                  );
                }

                const new_current = pf.nodes[id];
                if (!new_current) break;

                // Call runSingleNode recursively
                await runSingleNode({
                  pf,
                  current: new_current,
                  visited,
                  vars,
                  opt,
                  state,
                  executionCount,
                });
              }
            },
            next: resolve,
            console: capture_console
              ? {
                  ...console,
                  log(...args: any[]) {
                    run_visit.log.push(args);
                  },
                }
              : console,
          });
        } catch (e) {
          console.error(`Error executing node '${current.id}':`, e); // More informative error logging
          reject(e); // Ensure rejection propagates
        }
      }
    );

    if (!run_visit.branching) {
      run_visit.tstamp = Date.now();
    }

    if (opt?.delay) {
      await new Promise((done) => setTimeout(done, opt.delay));
    }

    if (after_node) {
      after_node({ visited: visited, node: current });
    }

    if (execute_node) {
      for (const id of execute_node.flow) {
        // Allow tracking even if executed again
        if (id === current.id) {
          continue;
        }

        const new_current = pf.nodes[id];
        if (new_current) {
          await runSingleNode({
            pf,
            current: new_current,
            branch: execute_node,
            visited,
            vars,
            opt,
            executionCount,
            state,
          });
        }
      }
    }

    return !run_visit.branching;
  } catch (e: any) {
    run_visit.tstamp = Date.now();
    run_visit.error = e;
    console.error(`Error processing node:`, e); // More informative output
    return false;
  }
};
