import { Server, WebSocketHandler } from "bun";

declare global {
  interface PrasiServer extends Record<string, any> {
    ws?: WebSocketHandler<{ url: string }>;
    http: (arg: {
      url: { raw: URL; pathname: string };
      req: Request;
      server: Server;
      mode: "dev" | "prod";
      handle: (
        req: Request,
        opt?: {
          rewrite?: (arg: {
            body: Bun.BodyInit;
            headers: Headers | any;
          }) => Bun.BodyInit;
        }
      ) => Response | Promise<Response>;
      serveStatic?: any;
      serveAPI?: any;
      index: { head: string[]; body: string[]; render: () => string };
      prasi: { page_id?: string; params?: Record<string, any> };
    }) => Response | Promise<Response>;
    init?: (arg: { port?: number }) => Promise<void>;
  }
}
