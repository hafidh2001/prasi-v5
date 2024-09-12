import goober from "goober";
declare global {
  const navigate: (path: string) => void;
  const params: any;
  const css: typeof goober.css;
  const cx: (...arg: any[]) => string;
  const _api: any;
  const prasiContext: any;
  const serverurl: string;
}
export {};
