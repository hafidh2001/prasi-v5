export type SingleExportVar =
  | { name: string; type: "local"; value: string }
  | { type: "passprop"; name: string; value: string };
