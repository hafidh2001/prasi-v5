export const loadCache = async <T>(arg: {
  is_cached: () => any | undefined;
  load: () => Promise<T>;
  save: (data: T, is_new: boolean) => void;
}): Promise<T> => {
  const { load, is_cached, save } = arg;
  const cached = is_cached();
  if (!cached) {
    const data = await load();
    save(data, true);
    return data;
  }
  load().then((data) => {
    save(data, true);
  });

  return cached;
};
