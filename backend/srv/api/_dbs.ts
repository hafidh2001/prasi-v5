import { db } from "prasi-db/db";
import type { ServerCtx } from "../utils/server/ctx";
import { execQuery } from "../utils/db/query";
import { compressed } from "../utils/server/compressed";
import { gunzipSync } from "bun";
import { unpack } from "msgpackr";

export default {
  url: "/_dbs/**",
  api: async (ctx: ServerCtx) => {
    if (ctx.url.pathname === "/_dbs/check") {
      return new Response(JSON.stringify({ mode: "encrypted" }), {
        headers: { "content-type": "application/json" },
      });
    }

    const body = unpack(gunzipSync(await ctx.req.arrayBuffer()));
    const result = await execQuery(body, db);

    return compressed(ctx, result);
  },
};
