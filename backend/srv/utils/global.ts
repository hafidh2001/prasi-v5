export interface PrasiGlobal {
  reloadCount: number;
  mode: "prod" | "dev";
}

declare global {
  var g: PrasiGlobal;
}
