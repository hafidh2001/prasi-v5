import { memo } from "react";
import { Vi } from "vi/vi";
import { base } from "../loader/base";
import { w } from "../root/window";
import { useProdState } from "./store";
import { loadPages } from "../loader/page";

export const ProdRouter = memo(() => {
  const { router, pages, page, loadPage, update, comp, layout } = useProdState(
    ({ ref, state, action }) => ({
      pathname: state.pathname,
      router: ref.router,
      pages: ref.pages,
      loadPage: action.loadPage,
      page: state.page,
      layout: state.layout,
      comp: state.comps,
      comp_load: ref.promise.load_comp,
      ts: state.ts,
    })
  );

  const found = router?.lookup(base.pathname);
  const found_page = pages?.find((e) => e.id === found?.id);

  if (found_page) {
    if (found_page.id !== page?.id) {
      loadPage(found_page);
      return <></>;
    } else {
      if (page && page.content_tree) {
        return (
          <>
            <Vi
              comps={comp as any}
              page={page as any}
              layout={layout as any}
              loader={{
                async comps(ids) {},
                async pages(ids) {
                  loadPages(ids).then((result) => {
                    update((s) => {
                      for (const [k, v] of Object.entries(result) as any) {
                        if (pages[k]) {
                          pages[k].content_tree = v;
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
