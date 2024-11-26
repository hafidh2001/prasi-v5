import { join } from "path";
export const dir = {
  root: (path: string) => {
    return join(process.cwd(), path.replace(/\.\./gi, ""));
  },
  data: (path: string) => {
    return join(process.cwd(), "..", "data", path.replace(/\.\./gi, ""));
  },
};

export const isLocalPC = () => {
  return dir.root("") !== "/app/prasi/repo";
};
