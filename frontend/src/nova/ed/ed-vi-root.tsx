import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { EDGlobal } from "logic/ed-global";
import { useRef } from "react";
import { StoreProvider } from "utils/react/define-store";
import { useGlobal } from "utils/react/use-global";
import { ViComps } from "vi/lib/types";
import { ViRoot } from "vi/vi-root";
import { mainStyle } from "./ed-vi-style";

export const EdViRoot = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const ref = useRef({
    db: dbProxy(p.site.config.api_url),
    api: apiProxy(p.site.config.api_url),
    page: null as any,
    page_ts: 0,
    comps: {} as ViComps,
  }).current;

  console.log("re-render", ref.page_ts !== p.page.ts, ref.page_ts, p.page.ts);

  if (ref.page_ts !== p.page.ts) {
    ref.page = {
      id: p.page.cur.id,
      url: p.page.cur.url,
      root: p.page.cur.content_tree,
    };
    ref.page_ts = p.page.ts;
  }

  for (const [k, v] of Object.entries(p.comp.loaded)) {
    ref.comps[k] = v.content_tree;
  }

  return (
    <div
      className={cx(
        "w-full h-full flex flex-1 relative overflow-auto border-r",
        p.mode === "mobile" ? "flex-col items-center" : ""
      )}
    >
      <div className={mainStyle(p)}>
        <StoreProvider>
          <ViRoot
            api={ref.api}
            db={ref.db}
            page={ref.page}
            comps={ref.comps}
            loader={{ async comps(ids) {}, async pages(ids) {} }}
            mode={p.mode}
            enablePreload={false}
          />
        </StoreProvider>
      </div>
    </div>
  );
};
