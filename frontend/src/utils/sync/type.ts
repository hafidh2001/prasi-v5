import { ESite } from "logic/types";

export type WSReceiveMsg =
  | {
      action: "connected";
      conn_id: string;
    }
  | { action: "site-loading"; status: string }
  | { action: "site-ready"; site: ESite }
  | { action: "site-build-log"; log: string }
  | {
      action: "vsc-update";
      vars: Record<string, any>;
      tsc: Uint8Array;
    }
  | { action: "site-tsc-log"; log: string };
