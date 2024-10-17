import { useCallback, useEffect, useRef, useState } from "react";
import { createId } from "utils/script/create-id";

export const useLocal = <T extends Record<string, any>>(
  data: T,
  effect?: () => Promise<void>,
  deps?: any[]
): {
  [K in keyof T]: T[K];
} & { render: () => void } => {
  const [_, render] = useState(0);
  const ref = useRef({
    id: createId(),
    render_count: 0,
    rendering: true,
    render_pending: false,
    mounted: true,
    data: {
      ...data,
      render() {
        if (local.mounted) {
          if (!local.rendering) {
            if (local.render_count === Number.MAX_SAFE_INTEGER) {
              local.render_count = 0;
            }
            local.render_count++;
            render(local.render_count);
          } else {
            local.render_pending = true;
          }
        }
      },
    } as T & { render: () => void },
  });
  const local = ref.current;

  local.mounted = true;
  local.rendering = true;
  useEffect(() => {
    local.rendering = false;
    local.mounted = true;
    if (local.render_pending) {
      local.render_pending = false;
      local.data.render();
    }
  });

  if (effect) {
    useEffect(() => {
      effect();
    }, deps || []);
  }
  useEffect(() => {
    return () => {
      local.mounted = false;
    };
  }, []);

  return local.data as any;
};
