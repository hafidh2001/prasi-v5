import { memo } from "react";
import { base } from "../loader/base";
import { useProd } from "../root/use-prod";
import { w } from "../root/prasi-window";

export const ProdRouter = memo(() => {
  const { router, pages, page, loadPage, update, pathname } = useProd(
    ({ ref, state, action }) => ({
      pathname: state.pathname,
      router: ref.router,
      pages: ref.pages,
      loadPage: action.loadPage,
      page: state.page,
    })
  );

  const found = router?.lookup(base.pathname);
  const found_page = pages?.find((e) => e.id === found?.id);

  if (found_page) {
    if (found_page.id !== page?.id) {
      loadPage(found_page);
      return <></>;
    } else {
      return (
        <>
          <div
            onClick={() => {
              navigate("/moasfm");
            }}
          >
            {pathname}
            MOmoko
          </div>
        </>
      );
    }
  } else {
    update((s) => {
      s.page = null;
    });
  }

  if (w.ContentNotFound) {
    return <w.ContentNotFound />;
  }
  return <>NOT FOUND {pathname}</>;
});
