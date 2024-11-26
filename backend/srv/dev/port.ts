import { fs } from "utils/fs";

export const setupDevPort = async () => {
  g.rsbuild = await fs.read("port.json", "json");
};
