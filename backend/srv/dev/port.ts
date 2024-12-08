import { fs } from "utils/files/fs";

export const setupDevPort = async () => {
  g.rsbuild = await fs.read("port.json", "json");
};
