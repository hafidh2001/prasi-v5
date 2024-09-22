import { FC, Suspense, useEffect } from "react";
import { ErrorBox } from "./lib/error-box";
import { viInit } from "./lib/init-vi";
import { useVi } from "./lib/store";
import { ViProp } from "./lib/types";
import { ViRoot } from "./vi-root";

export const Vi: FC<ViProp> = ({
  page,
  comps,
  layout,
  loader,
  enablePreload,
}) => {
  const { load, ref, state_comps } = useVi(({ action, ref, state }) => ({
    load: action.init,
    state_page: state.page,
    state_comps: state.comps,
    ref,
  }));

  if (!ref.init) {
    ref.init = true;
    ref.loader.comps = loader.comps as any;
    viInit({ loader, enablePreload: !!enablePreload });
  }

  useEffect(() => {
    load({ page, comps, layout });
  }, [page, comps, layout]);

  return (
    <ErrorBox>
      <Suspense>
        <ViRoot />
      </Suspense>
    </ErrorBox>
  );
};
