import { $ } from "bun";
import { fs } from "utils/files/fs";

export const site_srv = {
  async init() {
    const cwd = fs.path("data:site-srv");

    if (!fs.exists("data:site-srv")) {
      await $`git clone https://github.com/rizrmd/prasi-srv site-srv --depth=1`
        .cwd(fs.path("data:/"))
        .quiet()
        .nothrow();
    } else {
      // await $`git reset --hard`.cwd(cwd).quiet().nothrow();
      // await $`git pull`.cwd(cwd).quiet().nothrow();
    }

    if (!fs.exists("data:site-srv")) {
      console.error(
        "ERROR: git command not found, please install git and try again."
      );
      process.exit(1);
    } else {
      await $`bun i`.cwd(cwd).quiet().nothrow();
    }
  },
};
