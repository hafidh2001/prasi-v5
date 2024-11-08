export const local_name = Symbol("local_name");
export const render_mode = Symbol("render_mode");

export const parentLocalArgs = (
  local: Record<string, any>,
  parents: Record<string, string>,
  id: string,
) => {
  let cur = id;
  const args: any = {};
  while (cur) {
    if (local[cur] && cur !== id) {
      const name = local[cur][local_name];
      if (name && !args[name]) {
        args[name] = local[cur];
      }
    }

    cur = parents[cur];
  }
  return args as Record<
    string,
    {
      render: () => void;
      proxy?: any;
      __autorender?: boolean;
      __item_id?: string;
    }
  >;
};
