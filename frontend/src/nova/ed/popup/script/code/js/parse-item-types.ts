export type SingleExportVar =
  | { name: string; type: "local"; value: string }
  | { name: string; type: "propname"; value?: string }
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
