import { StoreProvider } from "../../../utils/react/define-store";
import { useProd } from "../root/store";
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

export const PrasiRoot = () => {
  const { status } = useProd(({ state, action }) => ({
    status: state.status.router,
  }));

  return (
    <>
      {Date.now()}
      {status}
      <hr />
      <ProdRouter />
    </>
  );
};
