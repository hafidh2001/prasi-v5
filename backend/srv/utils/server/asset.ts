import { dir } from "../dir";
import { staticFile } from "../static";

export const asset = {
  prasi: await staticFile(dir.data("/prasi-static"), { index: true }),
  nova: await staticFile(dir.data("/site-static"), {
    index: false,
  }),
};
