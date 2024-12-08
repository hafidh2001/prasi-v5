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

  const onChange: WatchListener<string> = (type, filename) => {
    if (filename && !shouldExclude(filename)) {
      events(type, filename);
    }
  };

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
        watching[filename] = watch(pathname, { recursive: true }, onChange);
      }
    }
  }

  watching[""] = watch(dir, (type, filename) => {
    onChange(type, filename);
    if (filename) {
      const pathname = join(dir, filename);
      const s = statSync(pathname, { throwIfNoEntry: false });

      if (s) {
        if (s.isDirectory() && !watching[filename]) {
          watching[filename] = watch(pathname, { recursive: true }, onChange);
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
