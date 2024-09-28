import { CaseSensitive } from "lucide-react";
import { FC, useRef } from "react";
import { EString, PEInitProp } from "../lib/type";

import ContentEditable from "react-contenteditable";

export const PEString: FC<{
  base: EString;
  init: PEInitProp;
  renderValue?: JSX.Element;
  update: (value: string) => void;
}> = ({ base, init, renderValue, update }) => {
  const on = useRef({
    focus: () => {},
    blur: () => {},
    paste: (e: React.ClipboardEvent<HTMLDivElement>) => {},
  }).current;

  return (
    <>
      <div className="eicon">
        <CaseSensitive />
      </div>
      {renderValue ? (
        renderValue
      ) : (
        <ContentEditable
          tabIndex={0}
          className={cx("content-editable estring value-content")}
          spellCheck={false}
          contentEditable
          innerRef={(ref: HTMLInputElement | null) => {
            if (ref) {
              init({
                focus: () => {
                  ref.focus();
                },
                on,
              });
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onFocus={(e) => {
            on.focus();

            const div = e.currentTarget;
            selectAllDiv(div);
          }}
          onBlur={() => {
            on.blur();
          }}
          html={base.value}
          onChange={(e) => {
            update(e.currentTarget.value);
          }}
        ></ContentEditable>
      )}
    </>
  );
};

const selectAllDiv = (div: HTMLDivElement) => {
  const s = window.getSelection(),
    r = document.createRange();
  r.setStart(div, 0);
  r.setEnd(div, 0);
  if (s) {
    s.removeAllRanges();
    s.addRange(r);
  }
};
