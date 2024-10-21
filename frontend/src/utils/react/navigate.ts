import { w } from "utils/types/general";

export const navigate = (href: string) => {
  history.pushState({ prevUrl: window.location.href }, "", href);

  if (w.prasiContext && w.prasiContext.render) {
    w.prasiContext.render();
  }
};
