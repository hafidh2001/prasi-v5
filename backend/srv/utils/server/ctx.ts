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
  const pathname = req.url.substring(host.baselen).split("?").shift() || "";

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
    params: {} as any,
    query_params: parseQueryParams(req.url) as any,
  };
};

export type ServerCtx = ReturnType<typeof serverContext>;

const parseQueryParams = (pageHref: string) => {
  const searchParams = new URLSearchParams(
    pageHref.substring(pageHref.indexOf("?"))
  );
  const result: any = {};
  searchParams.forEach((v, k) => {
    result[k] = v;
  });

  return result as any;
};
