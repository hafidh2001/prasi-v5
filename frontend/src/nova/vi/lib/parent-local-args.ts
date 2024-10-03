export const __localname = Symbol("__localname");

export const parentLocalArgs = (
  local: Record<string, any>,
  parents: Record<string, string>,
  id: string
) => {
  let cur = id;
  const args: any = {};
  while (cur) {
    if (local[cur]) {
      const name = local[cur][__localname];
      if (name && !args[name]) {
        args[name] = local[cur];
      }
    }

    cur = parents[cur];
  }
  return args;
};
