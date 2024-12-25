import { removeAsync } from "fs-jetpack";
import { createContext, Script } from "node:vm";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import sync from "sync-directory";
import { c } from "utils/color";
import { editor } from "utils/editor";
import { fs } from "utils/files/fs";
import type { PrasiSite } from "utils/global";
import { debounce } from "utils/server/debounce";

export const siteLoaded = async (
  site_id: string,
  prasi: PrasiSite["prasi"]
) => {
  if (!g.site.loading[site_id]) {
    await waitUntil(() => g.site.loading[site_id]);
  }

  if (site_id === PRASI_CORE_SITE_ID) {
    waitUntil(() => fs.exists(`code:${site_id}/site/build/frontend`), {
      interval: 300,
    }).then(async () => {
      await removeAsync(fs.path(`root:backend/srv/psc`));
      sync(
        fs.path(`code:${site_id}/site/build/frontend`),
        fs.path(`root:backend/srv/psc`),
        {
          watch: true,
          type: "copy",
          supportSymlink: false,
        }
      );
    });
  }

  const loading = g.site.loading[site_id];

  g.site.loaded[site_id] = {
    build: loading.process,
    data: loading.data!,
    config: {},
    id: site_id,
    vm: {
      ctx: newContext(),
      script: null as any,
      reload: debounce(async () => {
        try {
          const site = g.site.loaded[site_id];
          let is_reload = false;

          if (site.vm.script) {
            delete site.vm.script;
            is_reload = true;
          }

          site.vm.script = new Script(
            await fs.read(
              `data:site-srv/main/internal/init-compiled.js`,
              "string"
            )
          );

          const cjs = site.vm.script.runInContext(site.vm.ctx);
          cjs(site.vm.ctx.module.exports, require, site.vm.ctx.module);
          site.vm.init = site.vm.ctx.module.exports.init;

          if (site.vm.init) {
            console.log(
              `${c.magenta}[SITE]${c.esc} ${site_id} ${is_reload ? "Reloading" : "Initializing"}.`
            );

            await site.vm.init({
              site_id,
              script_dir: fs.path(`code:${site_id}/site/build`),
              server: () => g.server,
              mode: "vm",
              prasi,
            });
          } else {
            console.log(
              `${c.magenta}[SITE]${c.esc} ${site_id} Failed to initialize.`
            );
          }
        } catch (e) {
          console.log(
            `${c.magenta}[SITE]${c.esc} ${site_id} Initialization Error.`
          );
          console.error(e);
        }
      }, 100),
    },
    process: {
      vsc_vars: {},
      log: {
        build_frontend: "",
        build_typings: "",
        build_backend: "",
        build_tailwind: "",
        run_server: "",
      },
      is_ready: { frontend: false, typings: false },
    },
    prasi,
  };
  delete g.site.loading[site_id];

  editor.broadcast(
    { site_id },
    { action: "site-ready", site: g.site.loaded[site_id].data }
  );
};

const newContext = () => {
  const exports = {};
  return createContext({
    module: { exports },
    exports,
    AbortController,
    AbortSignal,
    alert,
    Blob,
    Buffer,
    Bun,
    ByteLengthQueuingStrategy,
    confirm,
    atob,
    btoa,
    BuildMessage,
    clearImmediate,
    clearInterval,
    clearTimeout,
    console,
    CountQueuingStrategy,
    Crypto,
    crypto,
    CryptoKey,
    CustomEvent,
    Event,
    EventTarget,
    fetch,
    FormData,
    Headers,
    HTMLRewriter,
    JSON,
    MessageEvent,
    performance,
    process,
    prompt,
    queueMicrotask,
    ReadableByteStreamController,
    ReadableStream,
    ReadableStreamDefaultController,
    ReadableStreamDefaultReader,
    reportError,
    require,
    ResolveMessage,
    Response,
    Request,
    setImmediate,
    setInterval,
    setTimeout,
    ShadowRealm,
    SubtleCrypto,
    DOMException,
    TextDecoder,
    TextEncoder,
    TransformStream,
    TransformStreamDefaultController,
    URL,
    URLSearchParams,
    WebAssembly,
    WritableStream,
    WritableStreamDefaultController,
    WritableStreamDefaultWriter,
  });
};
