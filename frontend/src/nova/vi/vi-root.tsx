import { FC, Suspense } from "react";
import { ErrorBox } from "./lib/error-box";
import { viInit } from "./lib/init-vi";
import { useVi } from "./lib/store";
import { ViProp } from "./lib/types";
import { ViPage } from "./vi-page";

export const ViRoot: FC<ViProp> = ({
  page,
  comps,
  layout,
  loader,
  db,
  api,
  mode,
  wrapper,
  enable_cache_js,
  enable_preload,
  set_ref,
  edit_comp_id,
}) => {
  const {
    syncProp: syncProp,
    ref,
    resetCompInstance,
  } = useVi(({ action, ref, state }) => ({
    syncProp: action.syncProp,
    state_page: state.page,
    state_comps: ref.comps,
    ref,
    resetCompInstance: action.resetCompInstance,
  }));

  ref.resetCompInstance = resetCompInstance;

  if (set_ref) set_ref(ref);

  if (typeof enable_cache_js !== "undefined") {
    ref.cache_js = enable_cache_js;
  }

  if (!ref.init) {
    ref.init = true;
    ref.loader.comps = loader.comps as any;
    if (wrapper) ref.wrapper = wrapper;
    viInit({ loader, enablePreload: !!enable_preload });
  }

  syncProp({ page, comps, layout, db, api, mode, edit_comp_id });

  return (
    <ErrorBox>
      <Suspense>
        <ViPage />
      </Suspense>
    </ErrorBox>
  );
};
