export const cacheResolve = <T, K>({
  cached,
  load,
  store,
  resolve,
}: {
  cached: () => K;
  resolve: (cached: K) => T;
  load: () => Promise<T>;
  store: (result: T, cached?: T) => void;
}) => {
  return new Promise<T>((done) => {
    if (cached()) {
      load().then((result) => {
        store(result);
        done(result);
      });
      done(resolve(cached()));
    } else {
      load().then((result) => {
        store(result);
        done(result);
      });
    }
  });
};
