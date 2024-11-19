import { Loading } from "../../../utils/ui/loading";
import { w } from "../root/window";
import { useProdState } from "./store";
import { ProdRouter } from "./router";
export const isPreview = () => {
  return (
    location.hostname.split(".").length === 4 ||
    location.hostname === "prasi.app" ||
    location.hostname === "prasi.avolut.com" ||
    location.hostname.includes("ngrok") ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "10.0.2.2"
  ); // android localhost
};

export const PrasiEntry = () => {
  const { status, init, mode, page } = useProdState(
    ({ state: s, action: a, ref }) => ({
      status: s.status.router,
      mode: s.mode,
      page: ref.page,
      init: a.initRouter,
    })
  );
  if (status === "init") init();

  return (
    <>
      {status !== "ready" || (page && !page.root) ? (
        <>{w.ContentLoading ? <w.ContentLoading /> : <Loading />}</>
      ) : (
        <div className="relative flex flex-1 items-center justify-center">
          <div
            className={cx(
              "absolute flex flex-col items-stretch flex-1 bg-white main-content-preview",
              mode === "mobile"
                ? css`
                    @media (min-width: 1280px) {
                      border-left: 1px solid #ccc;
                      border-right: 1px solid #ccc;
                      width: 375px;
                      top: 0px;
                      overflow-x: hidden;
                      overflow-y: auto;
                      bottom: 0px;
                      contain: strict;
                    }
                    @media (max-width: 1279px) {
                      left: 0px;
                      right: 0px;
                      top: 0px;
                      bottom: 0px;
                      overflow-y: auto;
                    }
                  `
                : "inset-0 overflow-auto"
            )}
          >
            <ProdRouter />
          </div>
        </div>
      )}
    </>
  );
};
