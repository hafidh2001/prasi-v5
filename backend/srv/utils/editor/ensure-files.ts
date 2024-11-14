import { Glob } from "bun";
import { copyAsync, dirAsync, exists } from "fs-jetpack";
import { dirname } from "path";
import { dir } from "../dir";

export const ensureFiles = async (
  path: string,
  site_id: string,
  opt: { disable_lib: boolean }
) => {
  const _dir = dir.data(path);
  if (!exists(_dir)) {
    await dirAsync(_dir);
  }

  const tdir = "/backend/srv/utils/templates";
  const templates = new Glob("**").scan({
    cwd: dir.root(tdir),
  });

  let lib_modules = { dependencies: {} as Record<string, string> };
  if (exists(_dir + "/lib/modules.json") === "file") {
    try {
      lib_modules = await Bun.file(_dir + "/lib/modules.json").json();
    } catch (e) {}
  }

  try {
    for await (const t of templates) {
      const f = t.replaceAll("_", ".");
      const to = dir.data(path + `/${f}`);
      const file = Bun.file(to);
      const exists = await file.exists();

      if (!exists) {
        if (t === "index_tsx" && opt.disable_lib) {
          await Bun.write(
            to,
            `\
import "app/css/build.css";`
          );
        } else {
          const from = dir.root(`${tdir}/${t}`);
          await dirAsync(dirname(to));
          await copyAsync(from, to);
        }
      } else if (["typings/global.d.ts", ".vscode/settings.json"].includes(f)) {
        const from = dir.root(`${tdir}/${t}`);
        await Bun.write(to, await Bun.file(from).arrayBuffer());
      }
    }

    const pkg = Bun.file(dir.data(`${path}/package.json`));

    if (!(await pkg.exists())) {
      await new Promise<void>(async (done) => {
        await Bun.write(
          pkg,
          JSON.stringify(
            {
              name: "site-" + site_id,

              scripts: {
                startup:
                  "ulimit -c 0; tailwindcss --watch -i ./app/css/global.css -o ./app/css/build.css --minify",
              },
              ...lib_modules,
              trustedDependencies: ["core-js"],
            },
            null,
            2
          ),
          { mode: 777 }
        );
        done();
      });
    }
  } catch (e) {
    console.log("error ensure file", e);
  }
};
