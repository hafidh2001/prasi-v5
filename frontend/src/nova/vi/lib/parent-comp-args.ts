export const parentCompArgs = (
  parents: Record<string, string>,
  ref_comps: Record<string, any>,
  id: string,
  debug?: true
) => {
  let cur_id = id;
  const args: any = {};
  let i = 0;
  while (parents[cur_id]) {
    if (ref_comps[cur_id]) {
      for (const [k, v] of Object.entries(ref_comps[cur_id])) {
        if (typeof args[k] === "undefined") {
          args[k] = v;
        }
      }
    }
    cur_id = parents[cur_id];
    i++;
    if (i > 1000) {
      console.error("ERROR: item parent is cycling to child");
      break;
    }
  }
  return args;
};
