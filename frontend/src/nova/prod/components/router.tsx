import { StoreProvider } from "../../../utils/react/define-store";
import { useProd } from "../root/store";

export const ProdRouter = () => {
  const { router, status, init } = useProd(({ ref, state, action }) => ({
    router: ref.router,
    status: state.status,
    init: action.init,
  }));
  if (status.router === "init") init();
  console.log("router");

  return (
    <>
      {status.router}
      {router?.ctx.rootNode.type}
    </>
  );
};
