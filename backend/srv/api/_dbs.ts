import { db } from "prasi-db/db";
import type { ServerCtx } from "../utils/server/ctx";
import { execQuery } from "../utils/db/query";
import { compressed } from "../utils/server/compressed";

export default {
  url: "/_dbs/**",
  api: async (ctx: ServerCtx) => {
    const params = ctx.req.method === "POST" ? await ctx.req.json() : {};
    const result = await execQuery(params, db);

    if (params.table === "check") {
      return new Response("");
    }

    return compressed(ctx, result);
  },
};
