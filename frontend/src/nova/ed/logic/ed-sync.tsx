import { clientStartSync } from "../../../utils/sync/client";
import { Loading } from "../../../utils/ui/loading";
import { PG } from "./ed-global";

export const loadSession = (p: PG) => {
  const session = JSON.parse(
    localStorage.getItem("prasi-session") || "null"
  ) as { data: { user: { id: string; username: string } } };
  if (!session && location.pathname.startsWith("/ed/")) {
    location.href = "/login";
    return <Loading note="logging in" />;
  }

  if (session?.data?.user) {
    p.user.id = session.data.user.id;
    p.user.username = session.data.user.username;
  } else {
    p.user.id = "ab1390f5-40d5-448e-a8c3-84b0fb600930";
    p.user.username = "anonymous";
  }
};

export const edInitSync = (p: PG) => {
  loadSession(p);

  p.site.id = params.site_id;

  if (!p.sync)
    clientStartSync({
      user_id: p.user.id,
      site_id: params.site_id,
      page_id: params.page_id,
    }).then((sync) => {
      p.sync = sync;
    });

  return true;
};
