import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineReact } from "utils/react/define-react";
import { defineWindow } from "utils/react/define-window";
import "../../../index.css";
import { StoreProvider } from "../../../utils/react/define-store";
import { base } from "../loader/base";
import { PrasiEntry, isPreview } from "../react/entry";
import { w } from "./window";
import { rawProd } from "../react/store";

(async () => {
  import("./font");
  const div = document.getElementById("root");

  base.init();
  if (div) {
    await defineWindow(false);

    let react = {
      root: createRoot(div),
    };
    defineReact();

    //#region prasi site internal (loading ui + not found)
    try {
      let internal_url = "/_prasi/code/static/internal.js";
      let import_url = internal_url;
      if (location.pathname.startsWith("/prod")) {
        const patharr = location.pathname.split("/");
        import_url = `/prod/${patharr[2]}${internal_url}`;
      }
      let prasi_internal = false as any;

      try {
        const import_await = new Function(`return import("${import_url}")`);
        prasi_internal = await import_await();
      } catch (e) {
        console.error(e);
      }
      if (typeof prasi_internal === "object") {
        if (prasi_internal.Loading) w.ContentLoading = prasi_internal.Loading;
        if (prasi_internal.NotFound)
          w.ContentNotFound = prasi_internal.NotFound;
      }
    } catch (e) {}
    //#endregion

    w.navigateOverride = (_href: string) => {
      if (_href && _href.startsWith("/")) {
        if (isPreview()) {
          if (
            location.pathname.startsWith("/prod") &&
            !_href.startsWith("/prod")
          ) {
            const patharr = location.pathname.split("/");
            _href = `/prod/${patharr[2]}${_href}`;
          }
        }
      }
      return _href;
    };

    w.prasiContext.render = () => {
      rawProd().state.pathname = location.pathname;
    };

    react.root.render(
      <StrictMode>
        <StoreProvider>
          <PrasiEntry />
        </StoreProvider>
      </StrictMode>
    );
    if (document.body.classList.contains("opacity-0")) {
      document.body.classList.remove("opacity-0");
    }
  }
})();
