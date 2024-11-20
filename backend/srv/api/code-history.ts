import { gunzipSync } from "bun";
import type { ServerCtx } from "../utils/server/ctx";
import { decode } from "msgpackr";
import hash_sum from "hash-sum";
import { codeHistory, crdt_comps, crdt_pages } from "../ws/crdt/shared";
import { loopItem } from "prasi-frontend/src/nova/ed/crdt/node/loop-item";
export type ICodeHistory = {
  page_id?: string;
  comp_id?: string;
  item_id: string;
  type: "prop" | "js";
  prop_name?: string;
};

export default {
  url: "/code_history",
  async api(ctx: ServerCtx) {
    const { req, query_params } = ctx;
    if (req.method === "POST") {
      const body = decode(gunzipSync(await req.arrayBuffer())) as
        | {
            mode: "update";
            site_id: string;
            selector: ICodeHistory[];
          }
        | {
            mode: "list";
            site_id: string;
            selector: ICodeHistory;
          }
        | {
            mode: "read";
            comp_id?: string;
            site_id?: string;
            id: number;
          };

      if (body.mode === "update") {
        for (const sel of body.selector) {
          const timeout_id = hash_sum(sel);
          clearTimeout(codeHistory.timeout[timeout_id]);
          codeHistory.timeout[timeout_id] = setTimeout(() => {
            delete codeHistory.timeout[timeout_id];
            const { page_id, comp_id } = sel;
            let items = [] as any[];
            if (page_id) {
              const page = crdt_pages[page_id];
              if (page) {
                items = page.doc.getMap("data")?.toJSON().childs;
              }
            } else if (comp_id) {
              const comp = crdt_comps[comp_id];
              if (comp) {
                items = [comp.doc.getMap("data")?.toJSON()];
              }
            }

            if (items.length > 0) {
              loopItem(
                items,
                { active_comp_id: comp_id, comps: {} },
                async ({ item }) => {
                  if (item.id === sel.item_id) {
                    let text = "";
                    if (sel.type !== "prop") {
                      text = item.adv[sel.type] || "";
                    } else {
                      text = item.component.props[sel.prop_name].value;
                    }
                    if (text) {
                      if (page_id) {
                        const existing = codeHistory
                          .site(body.site_id)
                          .tables.page_code.find({
                            where: {
                              item_id: sel.item_id,
                              page_id: page_id,
                              prop_name: sel.prop_name || "",
                              type: sel.type,
                            },
                            limit: 1,
                            sort: { ts: "desc" },
                            select: ["id", "ts", "text"],
                          });

                        if (existing?.[0]?.text !== text) {
                          codeHistory.site(body.site_id).tables.page_code.save({
                            item_id: sel.item_id,
                            page_id: page_id,
                            prop_name: sel.prop_name || "",
                            type: sel.type,
                            ts: Date.now(),
                            text,
                          });
                        }
                      } else if (comp_id) {
                        const existing = codeHistory
                          .comp(comp_id)
                          .tables.comp_code.find({
                            where: {
                              item_id: sel.item_id,
                              comp_id: comp_id,
                              prop_name: sel.prop_name || "",
                              type: sel.type,
                            },
                            limit: 1,
                            sort: { ts: "desc" },
                            select: ["id", "ts", "text"],
                          });

                        if (existing?.[0]?.text !== text) {
                          codeHistory.comp(comp_id).tables.comp_code.save({
                            item_id: sel.item_id,
                            comp_id: comp_id,
                            prop_name: sel.prop_name || "",
                            type: sel.type,
                            ts: Date.now(),
                            text,
                          });
                        }
                      }
                    }
                  }
                }
              );
            }
          }, 5 * 1000);
        }
      } else if (body.mode === "list") {
        const { page_id, comp_id, item_id, type, prop_name } = body.selector;

        let list: any[] = [];

        const where: any = {
          item_id: item_id,
          type: type,
        };
        if (prop_name) {
          where.prop_name = prop_name;
        }
        if (comp_id) {
          where.comp_id = comp_id;
        }

        if (page_id) {
          list = codeHistory.site(body.site_id).tables.page_code.find({
            where,
            select: ["ts", "id"],
            sort: { ts: "desc" },
          });
        } else if (comp_id) {
          list = codeHistory.comp(comp_id).tables.comp_code.find({
            where,
            select: ["ts", "id"],
            sort: { ts: "desc" },
          });
        }
        return new Response(JSON.stringify({ ts: Date.now(), list }), {
          headers: { "content-type": "application/json" },
        });
      } else if (body.mode === "read") {
        let text = "";
        if (body.comp_id) {
          text =
            codeHistory.comp(body.comp_id).tables.comp_code.find({
              where: {
                id: body.id,
              },
              select: ["text"],
            })[0]?.text || "";
        } else if (body.site_id) {
          text =
            codeHistory.site(body.site_id).tables.page_code.find({
              where: {
                id: body.id,
              },
              select: ["text"],
            })[0]?.text || "";
        }

        return new Response(JSON.stringify({ code: text }), {
          headers: { "content-type": "application/json" },
        });
      }
    }
    return new Response(`{"status": "ok"}`, {
      headers: { "content-type": "application/json" },
    });
  },
};
