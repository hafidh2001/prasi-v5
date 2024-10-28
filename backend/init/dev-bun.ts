import { $, build } from "bun";
import { watch } from "fs";
process.chdir("./frontend");

const debounce = {
  prasi: null as any,
};

const rebuildPrasi = async () => {
  await $`rm -rf ../build`;
  await build({
    entrypoints: ["./src/index.tsx"],
    outdir: "../build",
    splitting: true,
    // sourcemap: "linked",
    // minify: true,
    external: ["react", "react-dom"],
    target: "browser",
    define: {
      "process.env.NODE_ENV": "'production'",
    },
  });
  await $`cp -r ./public/* ../build`;
};

await rebuildPrasi();
$`bunx tailwindcss -w -i ./src/index.css -o ../build/index.css`;
watch("./", (file) => {
  if (file?.startsWith("node_modules")) return;
  clearTimeout(debounce.prasi);
  debounce.prasi = setTimeout(() => {
    rebuildPrasi();
  }, 500);
});
