export const parentPassProps = (
  local: Record<string, Record<string | number, any>>,
  parents: Record<string, string>,
  id: string,
  idx: string | number
) => {
  let cur = id;
  const args: any = {};
  let parent_idx = idx;
  while (cur) {
    if (local[cur]) {
      const passprop = local[cur][parent_idx];
      if (passprop) {
        for (const [key, value] of Object.entries(passprop)) {
          if (key === "__idx") continue;
          if (!args.hasOwnProperty(key)) {
            args[key] = value;
          }
        }
        if (passprop.__idx) parent_idx = passprop.__idx;
        else break;
      }
    }

    cur = parents[cur];
  }
  return args;
};
