import { memo } from "react";
import { ViRoot } from "vi/vi-root";
import { base } from "../loader/base";
import { loadPages } from "../loader/page";
import { w } from "../root/window";
import { useProdState } from "./store";

export const ProdRouter = memo(() => {
  const {
    router,
    pages,
    page,
    loadPage,
    update,
    comps,
    layout,
    mode,
    db,
    api,
  } = useProdState(({ ref, state, action }) => ({
    pathname: state.pathname,
    mode: state.mode,
    router: ref.router,
    pages: ref.pages,
    loadPage: action.loadPage,
    page: state.page,
    layout: state.layout,
    comps: ref.comps,
    comp_status: state.status.comps,
    ts: state.ts,
    db: ref.db,
    api: ref.api,
  }));

  const found = router?.lookup(base.pathname);
  const found_page = pages?.find((e) => e.id === found?.id);

  if (found_page) {
    if (found_page.id !== page?.id) {
      loadPage(found_page);
      return <></>;
    } else {
      if (page && page.root) {
        return (
          <>
            <ViRoot
              mode={mode}
              comps={comps as any}
              page={page as any}
              layout={layout as any}
              db={db}
              api={api}
              loader={{
                async comps() {},
                async pages(ids) {
                  loadPages(ids).then((result) => {
                    update((s) => {
                      for (const [k, v] of Object.entries(result) as any) {
                        if (pages[k]) {
                          pages[k].root = v;
                        }
                      }
                      s.ts = Date.now();
                    });
                  });
                },
              }}
              enablePreload
            />
          </>
        );
      }
    }
  } else {
    update((s) => {
      s.page = null;
    });
  }

  if (w.ContentNotFound) {
    return <w.ContentNotFound />;
  }

  return (
    <div className="flex flex-1 items-center justify-center">Not Found</div>
  );
});
