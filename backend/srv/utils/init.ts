(global as any).g = global;

g.reloadCount ??= 0;
g.reloadCount++;

if (process.argv[process.argv.length - 1] === "dev") {
  g.mode = "dev";
} else {
  g.mode = "prod";
}
