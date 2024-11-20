export type SingleExportVar =
  | {
      name: string;
      type: "local";
      value: string;
      render_mode: "auto" | "manual";
    }
  | {
      type: "passprop";
      name: string;
      value: string;
      map?: { value?: string; item: string; idx?: string };
    }
  | {
      type: "loop";
      name: string;
      list: string;
    };
