import { clientStartSync } from "../../../utils/sync/client";
import { Loading } from "../../../utils/ui/loading";
import { prasi } from "../cprasi/lib/prasi";
import { PG } from "./ed-global";
import { EPage } from "./types";

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

export const initSync = (p: PG) => {
  loadSession(p);

  if (p.sync === null && params.site_id) {
    clientStartSync({
      p,
      user_id: p.user.id,
      site_id: params.site_id,
      page_id: params.page_id,
      async siteLoaded(sync) {
        p.sync = sync;

        if (p.site) {
          prasi.site = p.site;
          const page = (await p.sync!.page.load(params.page_id)) as EPage;
          if (!page) {
            p.status = "page-not-found";
            p.page.cur = null as any;
            alert(
              `Page ${params.page_id} not found. Redirecting to main page.`
            );
            location.href = `/ed/${p.site.id}`;
          } else {
            p.page.cur = page;
          }
        } else {
          alert(`Site ${params.site_id} not found`);
        }

        p.render();
      },
    });
  }

  return p.status === "ready";
};
