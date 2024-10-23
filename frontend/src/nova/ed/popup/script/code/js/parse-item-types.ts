export type SingleExportVar =
  | { name: string; type: "local"; value: string }
  | { name: string; type: "propname" }
  | { type: "passprop"; name: string; value: string };
