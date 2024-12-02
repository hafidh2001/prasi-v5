import { navigate } from "utils/react/navigate";
import { jscript } from "utils/script/jscript";
import { validate } from "uuid";
import { EdBase } from "../../nova/ed/ed-base";
import { EDGlobal, PG } from "../../nova/ed/logic/ed-global";
import { initSync, loadSession } from "../../nova/ed/logic/ed-sync";
import { page } from "../../utils/react/page";
import { useGlobal } from "../../utils/react/use-global";
import { useLocal } from "../../utils/react/use-local";
import { Loading } from "../../utils/ui/loading";
import { PRASI_CORE_SITE_ID } from "prasi-utils";
import { useEffect } from "react";
import { TopBtn } from "../../nova/ed/ui/top-btn";
import { Bug, Hammer, ScrollText } from "lucide-react";
import { iconVSCode } from "../../nova/ed/ui/icons";
import { DebugPopup } from "popup/debug/debug-popup";
import { active, getActiveTree } from "logic/active";
import { EPage } from "logic/types";
import { getActiveNode } from "crdt/node/get-node-by-id";

jscript.init();

export default page({
  url: "/ed/:site_id/:page_id",
  component: ({}) => {
    const p = useGlobal(EDGlobal, "EDITOR");
    const local = useLocal({
      new_site: false,
      debug_popup: false,
    });

    const w = window as any;

    w.isEditor = true;

    useEffect(() => {
      if (validate(params.page_id) && validate(params.site_id)) {
        localStorage.setItem(
          "prasi-last-open",
          JSON.stringify({ page_id: params.page_id, site_id: params.site_id })
        );

        if (!p.sync) {
          initSync(p);
        } else if (p.page.cur.id !== params.page_id) {
          (async () => {
            if (active.comp) {
              await getActiveTree(p).destroy();
              active.comp = null;
              active.comp_id = "";
            }
            await getActiveTree(p).destroy();
            p.page.tree = null as any;
            p.page.cur = null as any;
            p.render();

            const page = (await p.sync!.page.load(params.page_id)) as EPage;
            if (page) {
              p.page.cur = page;
              p.render();
            }
          })();
        }
      } else {
        if (!validate(params.site_id)) {
          const last_open_str = localStorage.getItem("prasi-last-open");

          try {
            const last_open = JSON.parse(last_open_str || "");

            if (last_open.site_id && last_open.page_id) {
              navigate(`/ed/${last_open.site_id}/${last_open.page_id}`);
            } else {
              navSitePage(p);
            }
          } catch (e) {
            navSitePage(p);
          }
        } else {
          navSitePage(p);
        }
      }
    }, [location.pathname]);

    if (p.status === "no-site") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
          {!local.new_site && (
            <div className="flex flex-col p-10 rounded-lg border shadow-2xl">
              <div className="text-3xl">Welcome to Prasi</div>
              <div className="">
                You are logged in!
                <br />
                <br /> Now ask someone to invite to their site.
                <br /> Or you can{" "}
                <span
                  className="underline text-blue-500 cursor-pointer"
                  onClick={() => {
                    local.new_site = true;
                    local.render();
                  }}
                >
                  create your own site
                </span>
                <br />
                <br />
                Change account?{" "}
                <a
                  href="/logout"
                  className="underline text-blue-500 cursor-pointer"
                >
                  Logout here
                </a>
                .
              </div>
            </div>
          )}
        </div>
      );
    }

    if (!p.site || !p.page.cur) {
      return (
        <>
          <Loading
            backdrop={false}
            pointer
            note={p.ui.site.loading_status}
            alt={
              <div className="flex flex-col mt-3 items-center">
                <div className="mb-3 flex space-x-1">
                  <TopBtn
                    className={cx(
                      "hover:bg-blue-500 cursor-pointer text-[11px]"
                    )}
                    onClick={() => {
                      local.debug_popup = true;
                      local.render();
                    }}
                  >
                    <Bug size={12} />
                    <div>Debug</div>
                  </TopBtn>

                  <TopBtn
                    className={cx(
                      "hover:bg-blue-500 cursor-pointer text-[11px]"
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: iconVSCode }}
                      className={css`
                        svg {
                          width: 10px;
                        }
                      `}
                    ></div>
                    <div>VSCode</div>
                  </TopBtn>
                </div>

                <div className="text-[7px] whitespace-pre-wrap font-mono w-[230px] relative h-[40px] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 ">
                    {p.ui.site.build_log.join("\n")}
                  </div>
                  <div className="absolute bg-gradient-to-t from-white  to-transparent pointer-events-none inset-0 w-full h-full"></div>
                </div>
              </div>
            }
          />
          {local.debug_popup && <DebugPopup />}
        </>
      );
    }

    return <EdBase />;
  },
});

const navSitePage = (p: PG) => {
  if (params.site_id === "prasi") {
    location.href = `/ed/${PRASI_CORE_SITE_ID}`;
    return;
  }

  setTimeout(async () => {
    loadSession(p);
    const e = await _db.page.findFirst({
      where: {
        is_deleted: false,
        is_default_layout: false,
        site: validate(params.site_id)
          ? { id: params.site_id }
          : {
              org: {
                org_user: {
                  some: {
                    id_user: p.user.id,
                  },
                },
              },
            },
        name: {
          contains: "root",
          mode: "insensitive",
        },
      },
      select: { id: true, id_site: true },
      orderBy: {
        site: {
          name: "asc",
        },
      },
    });

    if (!p.page.cur?.id) {
      if (e && e.id && e.id_site) {
        location.href = `/ed/${e.id_site}/${e.id}`;
      } else {
        const e = await _db.page.findFirst({
          where: {
            is_deleted: false,
            is_default_layout: false,
            site: validate(params.site_id)
              ? { id: params.site_id }
              : {
                  org: {
                    org_user: {
                      some: {
                        id_user: p.user.id,
                      },
                    },
                  },
                },
            name: {
              contains: "home",
              mode: "insensitive",
            },
          },
          select: { id: true, id_site: true },
        });

        if (e && e.id && e.id_site) {
          location.href = `/ed/${e.id_site}/${e.id}`;
        } else {
          const e = await _db.page.findFirst({
            where: {
              is_deleted: false,
              is_default_layout: false,
              site: validate(params.site_id)
                ? { id: params.site_id }
                : {
                    org: {
                      org_user: {
                        some: {
                          id_user: p.user.id,
                        },
                      },
                    },
                  },
            },
            select: { id: true, id_site: true },
          });
          if (e) {
            if (e.id && e.id_site) {
              location.href = `/ed/${e.id_site}/${e.id}`;
            } else {
              p.status = "no-site";
              p.render();
            }
          } else {
            if (validate(params.site_id)) {
              const page = await _db.page.create({
                data: {
                  content_tree: {
                    childs: [],
                    id: "root",
                    type: "root",
                  },
                  name: "home",
                  url: "/",
                  id_site: params.site_id,
                },
              });

              location.href = `/ed/${params.site_id}/${page.id}`;
              return;
            } else {
              p.status = "no-site";
              p.render();
            }
          }
        }
      }
    }
  });
};
