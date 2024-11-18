import { getActiveNode } from "crdt/node/get-node-by-id";
import { active } from "logic/active";
import { PG } from "logic/ed-global";

export const mainStyle = (p: PG) => {
  const scale = parseInt(p.ui.zoom.replace("%", "")) / 100;

  let width = `${(1 / scale) * 100}%`;
  if (p.mode === "mobile") {
    width = `${(1 / scale) * 375}px`;
  }
  const item = getActiveNode(p)?.item;

  return cx(
    "absolute flex main-editor-content overflow-auto",
    css`
      contain: strict;

      .text-block {
        cursor: pointer;
      }
    `,
    p.mode === "mobile"
      ? css`
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          background: white;
          top: 0px;
          overflow-x: hidden;
          overflow-y: auto;
          bottom: 0px;
        `
      : "inset-0",
    p.mode === "mobile"
      ? css`
          width: ${width};
          height: ${`${(1 / scale) * 100}%`};
          transform: scale(${scale});
          transform-origin: 50% 0% 0px;
        `
      : css`
          width: ${width};
          height: ${`${(1 / scale) * 100}%`};
          transform: scale(${scale});
          transform-origin: 0% 0% 0px;
        `,
    active.hover.id &&
      p.ui.editor.hover !== "disabled" &&
      css`
        .s-${active.hover.id} {
          &::after {
            content: " ";
            pointer-events: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border: 2px solid #73b8ff;
          }
        }
      `,
    active.item_id === item?.id &&
      p.ui.editor.hover === "enabled"  &&
      css`
        .s-${active.item_id} {
          outline: none;

          &.text-block {
            cursor: text;
          }

          &::after {
            content: " ";
            pointer-events: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border: 2px solid #1c88f3;
          }
        }
      `
  );
};
