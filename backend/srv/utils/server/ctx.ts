import type { Server } from "bun";

const host = {
  base: "",
  baselen: 0,
};

export type WSContext = { pathname: string };

export const serverContext = (server: Server, req: Request) => {
  if (!host.base) {
    const url = new URL(req.url);
    host.base = `${url.protocol}//${url.host}`;
    host.baselen = host.base.length;
  }
  const pathname = req.url.substring(host.baselen);

  let ws = false;
  if (
    server.upgrade(req, {
      data: { pathname } as WSContext,
    })
  ) {
    ws = true;
  }

  return {
    ws,
    url: { pathname, full: req.url },
    req,
  };
};

export type ServerCtx = ReturnType<typeof serverContext>;
