import type { ServerCtx } from "../utils/server/ctx";

export default {
  url: "/code_history",
  async api(ctx: ServerCtx) {
    const { params, req } = ctx;
    const body = await req.json();
    return new Response(JSON.stringify(params), {
      headers: { "content-type": "application/json" },
    });
  },
};
