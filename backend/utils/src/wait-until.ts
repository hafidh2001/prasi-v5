export const waitUntil = (
  condition: number | (() => any),
  arg?: { timeout?: number; interval?: number }
) => {
  return new Promise<void>(async (resolve) => {
    if (typeof condition === "function") {
      let tout = null as any;
      if (arg?.timeout) {
        tout = setTimeout(resolve, arg?.timeout);
      }
      if (await condition()) {
        clearTimeout(tout);
        resolve();
        return;
      }
      let count = 0;
      const c = setInterval(async () => {
        if (await condition()) {
          if (tout) clearTimeout(tout);
          clearInterval(c);
          resolve();
        }
        if (count > 100) {
          clearInterval(c);
        }
      }, arg?.interval || 10);
    } else if (typeof condition === "number") {
      setTimeout(() => {
        resolve();
      }, condition);
    }
  });
};
