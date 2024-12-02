import { apiProxy } from "base/load/api/api-proxy";
import { dbProxy } from "base/load/db/db-proxy";
import { activateItem, active, getActiveTree } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { PRASI_CORE_SITE_ID, waitUntil } from "prasi-utils";
import { memo, useEffect, useRef, useState } from "react";
import { StoreProvider } from "utils/react/define-store";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Loading } from "utils/ui/loading";
import { ViComps, ViPageRoot, ViWrapperType } from "vi/lib/types";
import { ViRoot } from "vi/vi-root";
import { EdTreeCtxMenu } from "./tree/parts/ctx-menu";
import { IItem } from "utils/types/item";
import { prasi } from "../../cprasi/lib/prasi";

export const EdViRoot = memo(() => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const ref = useRef({
    db: dbProxy(p.site!.config.api_url),
    api: apiProxy(p.site!.config.api_url),
    page: null as ViPageRoot | null,
    comps: {} as ViComps,
    wrapper: ViWrapper({
      p,
      render: p.render,
    }),
    exports: {
      status: "init" as "init" | "loading" | "done",
      values: {
        prasi: null as any,
      },
      vars: [] as string[],
      typings: "",
    },
  }).current;
  const [, _set] = useState({});
  const render = () => _set({});
  useEffect(() => {
    (async () => {
      ref.exports.status = "loading";

      await Promise.all([
        new Promise<void>(async (done) => {
          try {
            const fn = new Function(
              `return import('/prod/${p.site!.id}/js/index.js');`
            );
            ref.exports.values = { ...(await fn()), prasi };
          } catch (e) {
            console.error(e);
          }
          done();
        }),
        new Promise<void>(async (done) => {
          const site = p.site;

          if (site) {
            const res = await fetch(`/prod/${site.id}/_prasi/type_vsc`);
            const json = (await res.json()) as {
              vars: Record<string, string>;
              source: string;
            };
            if (json.vars && json.source) {
              applyVscTypings(p, json);
            }
          }
          done();
        }),
      ]);
      ref.exports.status = "done";
      render();
    })();
  }, []);

  p.ui.editor.render = render;
  if (!p.page.cur) return <Loading />;
  if (ref.page?.root !== p.page.cur.content_tree || !ref.page) {
    ref.page = {
      id: p.page.cur.id,
      url: p.page.cur.url,
      root: p.page.cur.content_tree,
    };
  }

  if (!ref.page.root) {
    waitUntil(() => p.page.cur.content_tree).then(() => {
      render();
    });
  }

  for (const [k, v] of Object.entries(p.comp.loaded)) {
    ref.comps[k] = v.content_tree;
  }

  return (
    <>
      {!ref.page.root || ref.exports.status !== "done" ? (
        <Loading note="root-page" />
      ) : (
        <StoreProvider>
          <ViRoot
            edit_comp_id={active.comp_id}
            api={ref.api}
            db={ref.db}
            page={ref.page}
            comps={ref.comps}
            loader={{ async comps(ids) {}, async pages(ids) {} }}
            mode={p.mode}
            enable_preload={false}
            wrapper={ref.wrapper}
            setRef={(ref) => {
              p.viref = ref;
            }}
            vscode_exports={ref.exports.values}
          />
        </StoreProvider>
      )}
    </>
  );
});

const ViWrapper = ({ p, render }: { p: PG; render: () => void }) =>
  (({ item, is_layout, ViRender, merged, instance_id, standalone }) => {
    const local = useLocal({
      ctx_menu: null as any,
      item: null as null | IItem,
    });

    return (
      <>
        {/* @ts-ignore */}
        <ViRender
          item={item}
          is_layout={is_layout}
          merged={merged}
          instance_id={instance_id}
          standalone={standalone}
          wrapped={true}
          div_props={({ item, ref, instance_id }) => ({
            //@ts-ignore
            contentEditable: item.type === "text" ? true : undefined,
            ref: (el) => {},
            onPointerEnter(e) {
              //@ts-ignore
              if (instance_id) {
                //@ts-ignore
                const instance = ref.comp_props[instance_id];
                if (instance) {
                  //@ts-ignore
                  const cur = getActiveTree(p).nodes.map[item.id];
                  if (!cur) {
                    active.hover.id = instance_id;
                    render();
                    return;
                  }
                }
              }
              active.hover.id = item.id;
              render();
            },
            onPointerLeave(e) {
              if (instance_id) {
                const cur = getActiveTree(p).nodes.map[item.id];
                if (!cur) {
                  active.hover.id = "";
                  render();
                  return;
                }
              } else {
                active.hover.id = "";
                render();
              }
            },
            spellCheck: item?.type === "text" ? false : undefined,
            onBlur:
              item.type === "text"
                ? (e) => {
                    const content = e.currentTarget.innerHTML || "";
                    getActiveTree(p).update("Update Text", ({ findNode }) => {
                      //@ts-ignore
                      const n = findNode(item.id);
                      if (n) {
                        n.item.html = content;
                      }
                    });
                  }
                : undefined,
            onDoubleClick(e) {
              p.ui.popup.script.open = true;
              p.render();
            },
            onPointerDown(e) {
              if (active.item_id === item.id) {
                if (p.ui.editor.hover === "temporary-disabled") {
                  p.ui.editor.hover = "enabled";
                }
                render();
                e.stopPropagation();
                return;
              }

              e.stopPropagation();
              e.preventDefault();
              p.ui.tree.prevent_tooltip = true;
              if (instance_id) {
                //@ts-ignore
                const instance = ref.comp_props[instance_id];
                if (instance) {
                  const cur = getActiveTree(p).nodes.map[item.id];
                  if (!cur) {
                    activateItem(p, instance_id);
                    render();
                    return;
                  }
                }
              }

              activateItem(p, item.id);
              render();
            },
            onContextMenu(e) {
              e.preventDefault();
              e.stopPropagation();
              if (item) {
                local.ctx_menu = e;
                local.item = JSON.parse(JSON.stringify(item));
                local.render();
              }
            },
          })}
        />
        {local.ctx_menu && local.item && (
          <EdTreeCtxMenu
            event={local.ctx_menu}
            onClose={() => {
              local.ctx_menu = null;
              local.render();
            }}
            raw={{ data: { item: local.item } } as any}
          />
        )}
      </>
    );
  }) as ViWrapperType;

export const applyVscTypings = (
  p: PG,
  arg: { vars: Record<string, string>; source: string }
) => {
  p.script.typings_vscode = arg.source;
  p.script.typings_entry = `
import * as _ from "frontend/index";

declare global {
${Object.entries(arg.vars)
  .map(([name, type]) => {
    return `  ${type} ${name} = _.${name};`;
  })
  .join("\n")}
}
export {};
`;

  if (
    p.ui.popup.script.open &&
    ["js", "prop"].includes(p.ui.popup.script.mode) &&
    p.script.monaco
  ) {
    const models = p.script.monaco.editor.getModels();
    for (const model of models) {
      if (model.uri.toString() === `file:///typings-vscode.d.ts`) {
        model.setValue(p.script.typings_vscode);
      }

      if (model.uri.toString() === `file:///typings-entry.d.ts`) {
        model.setValue(p.script.typings_entry);
      }
    }
  }
};
