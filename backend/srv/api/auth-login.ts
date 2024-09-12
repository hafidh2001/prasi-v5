import argon from "@node-rs/argon2";
import type { ServerCtx } from "../utils/server/ctx";
import { compressed } from "../utils/server/compressed";

export default {
  url: "/auth_login",
  api: async (ctx: ServerCtx) => {
    const [username, password] = await ctx.req.json();

    const user = await _db.user.findFirst({
      where: { OR: [{ username }, { phone: username }] },
      include: {
        org_user: {
          select: {
            org: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        org: {
          select: { id: true, name: true },
        },
      },
    });
    if (user && user.org_user) {
      user.org = user.org_user.map((e) => e.org);
      delete (user as any).org_user;
    }
    if (!!user && (await argon.verify(user.password, password))) {
      //@ts-ignore
      delete user.password;

      return compressed(ctx, { status: "ok", user });
    }

    return compressed(ctx, {
      status: "failed",
      reason: "invalid username/password",
    });
  },
};
