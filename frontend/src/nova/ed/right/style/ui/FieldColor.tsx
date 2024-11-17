import { FC, useEffect } from "react";
import { FieldColorPicker } from "./FieldColorPopover";
import { useLocal } from "utils/react/use-local";

export const color = {
  openedPopupID: {} as Record<string, boolean>,
  lastColorPicked: "",
};

export const FieldColor: FC<{
  popupID: string;
  value?: string;
  update: (value: string) => void;
  showHistory?: boolean;
}> = ({ value, update, showHistory = true, popupID }) => {
  if (!color.openedPopupID) color.openedPopupID = {};

  const local = useLocal({
    val: color.lastColorPicked || "",
    update_timeout: null as any,
  });

  useEffect(() => {
    if (!color.openedPopupID[popupID]) {
      if (value) {
        color.lastColorPicked = value;
      }
      local.val = value || "";
      local.render();
    }
  }, [value]);

  const onOpen = () => {
    color.openedPopupID[popupID] = true;
    local.render();
  };

  const onClose = () => {
    delete color.openedPopupID[popupID];
    color.lastColorPicked = "";
    local.render();
  };

  if (typeof local.val === "string" && local.val.length > 10) {
    update("");
    return null;
  }

  return (
    <FieldColorPicker
      value={local.val}
      update={(val) => {
        local.val = val;
        local.render();
        clearTimeout(local.update_timeout);
        local.update_timeout = setTimeout(() => {
          update(val);
        }, 10);
      }}
      onOpen={onOpen}
      onClose={onClose}
      open={color.openedPopupID[popupID]}
      showHistory={showHistory}
    >
      <div
        className={cx(
          css`
            background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>');
          `,
          "cursor-pointer"
        )}
      >
        <div
          className={cx(
            css`
              background: ${local.val};
              width: 30px;
              height: 20px;
            `,
            "color-box"
          )}
        ></div>
      </div>
    </FieldColorPicker>
  );
};
