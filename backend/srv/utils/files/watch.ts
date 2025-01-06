import { statSync, watch, type WatchListener } from "fs";
import { list } from "fs-jetpack";
import { join } from "path";
export const watchFiles = ({
  dir,
  events,
  exclude,
}: {
  dir: string;
  events: WatchListener<string>;
  exclude?: (pathname: string) => boolean;
}) => {
  const watching = {} as Record<string, ReturnType<typeof watch>>;

  const createOnChange = (base_dir: string) =>
    ((type, filename) => {
      if (filename) {
        const pathname = base_dir ? join(base_dir, filename) : filename;
        if (!shouldExclude(pathname)) {
          events(type, pathname);
        }
      }
    }) as WatchListener<string>;

  const shouldExclude = (pathname: string) => {
    if (pathname && exclude) {
      return exclude(pathname);
    }
    return false;
  };

  for (const filename of list(dir) || []) {
    const pathname = join(dir, filename);
    const s = statSync(pathname, { throwIfNoEntry: false });

    if (s && s.isDirectory()) {
      if (!watching[filename]) {
        watching[filename] = watch(
          pathname,
          { recursive: true },
          createOnChange(filename)
        );
      }
    }
  }

  const onChange = createOnChange("");

  watching[""] = watch(dir, (type, filename) => {
    onChange(type, filename);
    if (filename) {
      const pathname = join(dir, filename);
      const s = statSync(pathname, { throwIfNoEntry: false });

      if (s) {
        if (s.isDirectory() && !watching[filename]) {
          watching[filename] = watch(pathname, { recursive: false }, onChange);
        }
      } else {
        if (watching[filename]) {
          watching[filename].close();
          delete watching[filename];
        }
      }
    }
  });
  return watching;
};
