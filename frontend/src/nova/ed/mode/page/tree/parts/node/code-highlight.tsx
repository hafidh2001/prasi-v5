import { highlightElement, ShjLanguage } from "@speed-highlight/core";
import { FC, useEffect, useRef } from "react";
import "@speed-highlight/core/themes/github-light.css";
export const CodeHighlight: FC<{
  children: any;
  language?: ShjLanguage;
  format?: (input: string) => string;
}> = ({ children, language = "ts", format }) => {
  const r = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (r.current) {
      highlightElement(r.current, language);
    }
  }, [r.current]);

  return (
    <div className="relative overflow-auto w-[600px] h-[300px] border-t border-t-slate-800">
      <pre
        ref={r}
        className={cx(
          "absolute inset-0",
          css`
            font-size: 9px !important;
            font:
              9px / 14px "Liga Menlo",
              Consolas,
              Courier New,
              Monaco,
              Andale Mono,
              Ubuntu Mono,
              monospace !important;
            padding: 5px 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          `
        )}
      >
        {format ? format(children) : children}
      </pre>
    </div>
  );
};
