import {
  DragPreviewRender,
  PlaceholderRender,
} from "@minoru/react-dnd-treeview";
import { PNode } from "logic/types";
import { FC } from "react";

export const DragPreview: DragPreviewRender<PNode> = (props) => {
  const node = props.item;

  return (
    <div
      className={cx("bg-blue-500 text-white px-4 py-[2px] text-sm inline-grid")}
    >
      <div>{node.data?.item?.name || (node.data as any)?.name}</div>
    </div>
  );
};
export const DEPTH_WIDTH = 5;

export const Placeholder: FC<{
  node: Parameters<PlaceholderRender<PNode>>[0];
  params: Parameters<PlaceholderRender<PNode>>[1];
}> = ({ params }) => {
  return (
    <div
      className={cx(
        "flex items-center bg-blue-50 bg-opacity-50",
        css`
          height: 10px;
          z-index: 99;
          position: absolute;
          left: ${(params.depth + 1) * DEPTH_WIDTH - 3}px;
          transform: translateY(-50%);
          right: 0px;
        `
      )}
    >
      <div
        className={cx(
          "flex-1",
          css`
            background-color: #1b73e8;
            height: 2px;
          `
        )}
      ></div>
    </div>
  );
};
