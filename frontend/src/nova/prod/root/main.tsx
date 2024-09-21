import { createRoot } from "react-dom/client";
import "../../../index.css";
import { PrasiRoot, isPreview } from "../components/root";
import { defineWindow } from "utils/react/define-window";
import { defineReact } from "utils/react/define-react";
import { w } from "./prasi-window";
import { initBaseConfig } from "prod/loader/base";
import { StoreProvider } from "../../../utils/react/define-store";

(async () => {
  import("./font");
  const div = document.getElementById("root");
  initBaseConfig();
  if (div) {
    await defineWindow(false);

    let react = {
      root: createRoot(div),
    };
    defineReact();

    //#region prasi site internal (loading ui + not found)
    try {
      let internal_url = "/_prasi/code/internal.js";
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

    react.root.render(
      <StoreProvider>
        <PrasiRoot />
      </StoreProvider>
    );
    if (document.body.classList.contains("opacity-0")) {
      document.body.classList.remove("opacity-0");
    }
  }
})();
