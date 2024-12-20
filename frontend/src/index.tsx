import { Root as ReactRoot, createRoot } from "react-dom/client";
import { apiProxy } from "./base/load/api/api-proxy";
import { loadApiProxyDef } from "./base/load/api/api-proxy-def";
import { dbProxy } from "./base/load/db/db-proxy";
import { w } from "./utils/types/general";

import "@fontsource/source-sans-3";
import { Root } from "base/root";
import "./index.css";
import { defineReact } from "./utils/react/define-react";
import { defineWindow } from "./utils/react/define-window";

const start = async () => {
  const react = {
    root: null as null | ReactRoot,
  };

  const cur = new URL(w.basehost || location.href);
  const base_url = `${cur.protocol}//${cur.host}`;
  w._db = dbProxy(base_url);

  try {
    await loadApiProxyDef(base_url, false);
    w._api = apiProxy(base_url);
  } catch (e) {
    if (cur.host) {
      console.warn("Failed to load API:", base_url);
    }
  }

  w.serverurl = base_url;

  defineReact();
  await defineWindow(false);

  const el = document.getElementById("root");

  if (el) {
    react.root = createRoot(el);
    react.root.render(<Root />);
  }
};

start();
