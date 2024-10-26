import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getVersion, proxy, Snapshot, useSnapshot } from "valtio";

const default_ctx = { ctx: {} as any, render() {} };
const store_ctx = createContext<{
  ctx: Record<string, { ref: any; state: any }>;
  render: () => void;
}>(default_ctx);

export const StoreProvider = ({ children }: { children: any }) => {
  const [_, render] = useState({});

  return (
    <store_ctx.Provider
      value={{
        ...default_ctx,
        render() {
          render({});
        },
      }}
    >
      {children}
    </store_ctx.Provider>
  );
};

export const rawStore = function <T>(name: string) {
  return () => default_ctx.ctx[name] as { state: any; ref: any };
};

export const defineStore = function <
  R,
  T extends object,
  K extends { [V in string]: (...arg: any[]) => void | boolean },
  D,
>(init: {
  name: string;
  state: T;
  ref?: R;
  action: (arg: {
    ref: R;
    state: T;
    update: (fn: (state: T) => void) => void;
  }) => K;
  effect?: (arg: { state: Snapshot<T> }) => {
    deps: any[];
    effect: (arg: {
      state: Snapshot<T>;
      action: K;
      update: (fn: (state: T) => void) => void;
    }) => Promise<void>;
    cleanup?: () => void;
  }[];
}) {
  return <Z extends object>(
    selector: (arg: { ref: R; state: Snapshot<T>; action: K }) => Z
  ) => {
    const internal = useRef({
      mounted: true,
    });

    const store = useContext(store_ctx);
    const init_ctx = store.ctx;
    if (!init_ctx[init.name] && init.state) {
      init_ctx[init.name] = {
        state: proxy(init.state),
        ref: init.ref || {},
      };
    }
    const ctx = init_ctx[init.name];

    const ref = ctx.ref;
    const state = useSnapshot(ctx.state);
    const selection = selector({
      ref,
      state,
      action: createAction(ref, ctx.state, init),
    }) as Z & {
      update: (fn: (state: T) => void) => void;
    };

    selection.update = (fn) => {
      fn(ctx.state);
    };

    if (init.effect) {
      const effects = init.effect({ state: ctx.state });

      for (const e of effects) {
        useEffect(() => {
          internal.current.mounted = true;
          e.effect({
            action: createAction(ref, ctx.state, init),
            state: ctx.state,
            update(fn) {
              fn(ctx.state);
            },
          });
          return () => {
            internal.current.mounted = false;
            if (e.cleanup) {
              e.cleanup();
            }
          };
        }, e.deps);
      }
    }

    useEffect(() => {
      internal.current.mounted = true;
      return () => {
        internal.current.mounted = false;
      };
    }, Object.values(selection));

    return { ...selection };
  };
};

const createAction = (
  ref: any,
  state: any,
  init: {
    action: (arg: {
      state: any;
      ref: any;
      update: (fn: (state: any) => void) => void;
    }) => any;
  }
) => {
  return new Proxy(
    {},
    {
      get(target, p, receiver) {
        return function (...arg: any[]) {
          const actions = init.action({
            ref,
            state,
            update(fn) {
              fn(state);
            },
          });

          actions[p].bind(createAction(ref, state, init))(...arg);
        };
      },
    }
  ) as any;
};

// type Path = (string | symbol)[];

// interface DeepProxy {
//   __path: Path[];
//   [key: string]: any;
// }

// function createDeepProxy(): DeepProxy {
//   const root = {};

//   const paths = {} as Record<string, { __path: Path }>;

//   const handler: ProxyHandler<object> = {
//     get(target: any, prop: string | symbol, receiver: any) {
//       if (target === root) {
//         const id = createId();
//         paths[id] = { __path: [prop] };
//         return new Proxy(paths[id], handler);
//       }

//       if (prop === "__path") {
//         return target.__path;
//       }
//       target.__path.push(prop);

//       return new Proxy(target, handler);
//     },
//   };

//   return new Proxy(root, handler) as DeepProxy;
// }
// function cleanArray(arr: Path[]): Path[] {
//   const result: Path[] = [];
//   let currentGroup: Path | null = null;

//   for (const subArr of arr) {
//     if (!currentGroup) {
//       currentGroup = subArr; // Start a new group
//     } else if (subArr[0] === currentGroup[0]) {
//       // If it starts with the same character, keep adding
//       currentGroup = subArr;
//     } else {
//       // Save the current group and start a new one
//       result.push(currentGroup);
//       currentGroup = subArr;
//     }
//   }

//   if (currentGroup) {
//     result.push(currentGroup); // Append the last group
//   }

//   return result;
// }
