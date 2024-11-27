import { dir } from "../dir";
import { staticFile } from "../static";

export const asset = {
  prasi: await staticFile(dir.data("/prasi-static"), { index: "index.html" }),
  nova: await staticFile(dir.data("/site-static"), {
    index: "index.html",
  }),
  psc: await staticFile(dir.root("/backend/srv/psc/static")),
};
