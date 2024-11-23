import { ESite } from "logic/types";

export type WSReceiveMsg =
  | {
      action: "connected";
      conn_id: string;
      site: ESite;
    }
  | { action: "site-loading"; status: string };
