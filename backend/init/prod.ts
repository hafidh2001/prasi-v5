import { $ } from "bun";

await $`bunx rsbuild build`.cwd(`frontend/src/nova/prod`)
await $`bun run --silent --hot --no-clear-screen backend/srv/server.ts prod`;
