import { removeAsync } from "fs-jetpack";
import { createContext, Script } from "node:vm";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import sync from "sync-directory";
import { c } from "utils/color";
import { editor } from "utils/editor";
import { fs } from "utils/files/fs";
import type { PrasiSite } from "utils/global";
import { debounce } from "utils/server/debounce";
import { dirname, join } from "path";
import {
  copyFileSync,
  existsSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { addRoute, createRouter, findRoute } from "rou3";

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

  const pages = await _db.page.findMany({
    where: { is_deleted: false, id_site: site_id },
    select: { id: true, url: true },
  });
  const router = createRouter<{ page_id: string }>();
  for (const page of pages) {
    addRoute(router, undefined, page.url, { page_id: page.id });
  }
  g.site.loaded[site_id] = {
    build: loading.process,
    data: loading.data!,
    config: {},
    id: site_id,
    router_raw: {
      urls: pages,
      layout: { id: "", root: undefined },
    },
    router,
    vm: {
      ctx: newContext(),
      reload: debounce(async () => {
        try {
          const site = g.site.loaded[site_id];
          let is_reload = false;

          if (site.vm.init) {
            delete site.vm.init;
            is_reload = true;
          }

          let target_path = fs.path(
            join(`code:${site_id}/site/build`, dirname(prasi.paths.server))
          );

          if (existsSync(target_path)) {
            const dirs = readdirSync(fs.path(`data:site-srv/main/internal/vm`));
            for (const file of dirs) {
              if (file === "vm.ts") {
                continue;
              }

              if (existsSync(join(target_path, file))) {
                unlinkSync(join(target_path, file));
              }

              copyFileSync(
                fs.path(`data:site-srv/main/internal/vm/${file}`),
                join(target_path, file)
              );
            }
          }

          const vm = require(join(target_path, "vm.ts")).vm;
          site.vm.init = await vm(site.vm.ctx);

          if (site.vm.init) {
            console.log(
              `${c.magenta}[SITE]${c.esc} ${site_id} ${is_reload ? "Reloading" : "Starting"}.`
            );

            await site.vm.init({
              site_id,
              server: () => g.server,
              mode: "vm",
              prasi,
              dev: g.mode === "dev",
              action: is_reload ? "reload" : "start",
              content: {
                route(pathname: string) {
                  const found = findRoute(
                    site.router,
                    undefined,
                    pathname || ""
                  );
                  if (found) {
                    return {
                      params: found.params || {},
                      data: { page_id: found.data.page_id },
                    };
                  }
                  return undefined;
                },
                async pages(ids) {
                  return {};
                }, 
                async all_routes() {
                  return {
                    site: {
                      id: site_id,
                      api_url: site.data.config.api_url || "",
                    },
                    urls: site.router_raw.urls,
                    layout: site.router_raw.layout,
                  };
                },
              },
            });
          } else {
            console.log(
              `${c.magenta}[SITE]${c.esc} ${site_id} Failed to start.`
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
  const ctx = {
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
    prompt,
    process: {
      ...process,
      cwd() {
        return this._cwd;
      },
      chdir(cwd: string) {
        this._cwd = cwd;
      },
      _cwd: "",
    },
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
  } as any;
  ctx.global = ctx;
  ctx.globalThis = ctx;
  return createContext(ctx);
};
