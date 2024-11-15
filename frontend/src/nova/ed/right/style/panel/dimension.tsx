import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNDimension } from "utils/types/meta-fn";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { Tooltip } from "utils/ui/tooltip";
import { responsiveVal } from "../tools/responsive-val";
import { Button } from "../ui/Button";
import { FieldNumUnit } from "../ui/FieldNumUnit";
import { ToggleLeft, ToggleRight } from "lucide-react";

type DimensionUpdate = {
  dim: FNDimension;
};
export const PanelDimension: FC<{
  id: string;
  value: IItem;
  mode: "desktop" | "mobile";
  update: <T extends keyof DimensionUpdate>(
    key: T,
    val: DimensionUpdate[T]
  ) => void;
}> = ({ value, update, mode, id }) => {
  const local = useLocal({
    menuWidth: null as any,
    menuHeight: null as any,
    toggle: true as any,
    activeWidth: 0,
    activeHeight: 0,
    dim: responsiveVal<FNDimension>(value, "dim", mode, {
      w: "fit",
      h: "fit",
      wUnit: "px",
      hUnit: "px",
    }),
  });

  useEffect(() => {
    local.dim = responsiveVal<FNDimension>(value, "dim", mode, {
      w: "fit",
      h: "fit",
      wUnit: "px",
      hUnit: "px",
    });
    local.render();
  }, [value]);

  const dim = local.dim;

  const calculateAspectRatioFit = (props: {
    srcWidth: any;
    srcHeight: any;
    maxWidth: any;
    maxHeight: any;
  }) => {
    const { srcWidth, srcHeight, maxWidth, maxHeight } = props;
    var height = maxHeight;
    var width = maxWidth;
    if (
      typeof maxWidth === "number" &&
      typeof maxHeight === "number" &&
      typeof srcWidth === "number" &&
      typeof srcHeight === "number"
    ) {
      height =
        srcHeight === maxHeight ? (maxWidth * srcHeight) / srcWidth : maxHeight;
      width =
        srcWidth === maxWidth ? maxHeight * (srcWidth / srcHeight) : maxWidth;
      width = Number(width.toFixed(2));
      height = Number(height.toFixed(2));
    }
    return {
      width: width,
      height: height,
    };
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-end pb-1 justify-between">
        <div className="text-[10px] select-none text-slate-400">SIZE</div>
      </div>

      <div className="flex items-stretch space-x-1">
        <div
          className={cx(
            "flex flex-col space-y-1 text-xs ",
            css`
              .field-num {
                width: 66px !important;
                border: 1px solid #d1d1d1;
              }
            `
          )}
        >
          <div
            className={cx(
              "flex",
              css`
                .border {
                  width: 70px !important;
                }
                input {
                  width: 100%;
                }
                .field-num {
                  width: 50px !important;
                }
              `
            )}
          >
            <Tooltip content="Width">
              <FieldNumUnit
                positiveOnly
                hideUnit
                icon={
                  <div className="text-[10px] w-[15px] pr-[2px] mr-[3px] h-[14px] flex items-center justify-center border-r">
                    W
                  </div>
                }
                enableWhenDrag
                disabled={dim.w === "fit" || dim.w === "full" ? dim.w : false}
                value={dim.w + (dim.wUnit || "px")}
                unit={dim.wUnit || "px"}
                update={(val, setVal) => {
                  let _val = val;
                  if (typeof dim.w !== "number" && setVal) {
                    const nval = local.activeWidth || 0;
                    _val = nval + "";
                    setVal(nval);
                  }
                  local.dim.w = parseInt(_val);
                  update("dim", {
                    ...dim,
                    w: local.dim.w,
                    h: local.dim.h,
                  });
                  local.render();
                }}
              />
            </Tooltip>
            {local.menuWidth && (
              <Menu
                mouseEvent={local.menuWidth}
                onClose={() => {
                  local.menuWidth = null;
                  local.render();
                }}
              >
                <MenuItem
                  label="Fit"
                  onClick={() => {
                    local.dim.w = "fit";
                    if (false) {
                      local.dim.h = "fit";
                      update("dim", {
                        ...dim,
                        w: "fit",
                        h: "fit",
                      });
                    } else {
                      update("dim", {
                        ...dim,
                        w: local.dim.w,
                        h: local.dim.h,
                      });
                    }
                  }}
                />
                <MenuItem
                  label="Full"
                  onClick={() => {
                    local.dim.w = "full";
                    if (false) {
                      local.dim.h = "full";
                      update("dim", {
                        ...dim,
                        w: "full",
                        h: "full",
                      });
                    } else {
                      update("dim", {
                        ...dim,
                        w: local.dim.w,
                        h: local.dim.h,
                      });
                    }
                  }}
                />
                <MenuItem
                  label="Pixel"
                  onClick={() => {
                    local.dim.w = local.activeWidth || 0;
                    local.dim.wUnit = "px";
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
                <MenuItem
                  label="Percent"
                  onClick={() => {
                    local.dim.w = local.activeWidth || 0;
                    local.dim.wUnit = "%";

                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
              </Menu>
            )}

            <Button
              className={cx(
                "flex-1",
                css`
                  width: 24px;
                  max-width: 25px;
                  border-left: 0px !important;
                  padding: 0px !important;
                  min-width: 0px !important;
                `
              )}
              onClick={(e) => {
                local.menuWidth = e;
                local.render();
              }}
            >
              {dim.w === "full" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.5 7.5v-2h-1v5h1v-2h9v2h1v-5h-1v2h-9z"
                    fill="#000"
                  ></path>
                </svg>
              )}
              {dim.w === "fit" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3.354 4.646l-.708.708L5.293 8l-2.646 2.646.707.708L6.707 8 3.354 4.646zm10 .708L10.707 8l2.647 2.646-.708.708L9.293 8l3.354-3.354.707.708z"
                    fill="#000"
                  ></path>
                </svg>
              )}

              {dim.w !== "fit" && dim.w !== "full" && (
                <div className="w-[16px] h-[16px] flex items-center justify-center">
                  {dim.wUnit || "px"}
                </div>
              )}
            </Button>
          </div>

          <div
            className={cx(
              "flex",
              css`
                .border {
                  width: 70px !important;
                }
                input {
                  width: 100%;
                }
                .field-num {
                  width: 50px !important;
                }
              `
            )}
          >
            <Tooltip content="Height">
              <FieldNumUnit
                positiveOnly
                hideUnit
                icon={
                  <div className="text-[10px] w-[15px] pr-[2px] mr-[3px] h-[14px] flex items-center justify-center border-r">
                    H
                  </div>
                }
                disabled={dim.h === "fit" || dim.h === "full" ? dim.h : false}
                enableWhenDrag
                value={dim.h + (dim.hUnit || "px")}
                unit={dim.hUnit || "px"}
                update={(val, setVal) => {
                  let _val = val;
                  if (typeof dim.h !== "number" && setVal) {
                    const nval = local.activeHeight || 0;
                    _val = nval + "";
                    setVal(nval);
                  }

                  if (false) {
                    let res: any = calculateAspectRatioFit({
                      srcWidth: dim.w,
                      srcHeight: dim.h,
                      maxWidth: dim.w,
                      maxHeight: parseInt(_val),
                    });
                    update("dim", {
                      ...dim,
                      h: parseInt(_val),
                      w: res.width,
                    });
                    local.dim.h = parseInt(_val);
                    local.dim.w = res.width;
                  } else {
                    local.dim.h = parseInt(_val);
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }
                  local.render();
                }}
              />
            </Tooltip>
            {local.menuHeight && (
              <Menu
                mouseEvent={local.menuHeight}
                onClose={() => {
                  local.menuHeight = null;
                  local.render();
                }}
              >
                <MenuItem
                  label="Fit"
                  onClick={() => {
                    local.dim.h = "fit";
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
                <MenuItem
                  label="Full"
                  onClick={() => {
                    local.dim.h = "full";
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
                <MenuItem
                  label="Pixel"
                  onClick={() => {
                    local.dim.h = local.activeHeight || 0;
                    local.dim.hUnit = "px";
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
                <MenuItem
                  label="Percent"
                  onClick={() => {
                    local.dim.h = local.activeHeight || 0;
                    local.dim.hUnit = "%";
                    update("dim", {
                      ...dim,
                      w: local.dim.w,
                      h: local.dim.h,
                    });
                  }}
                />
              </Menu>
            )}
            <Button
              className={cx(
                "flex-1",
                css`
                  width: 24px;
                  max-width: 25px;
                  border-left: 0px !important;
                  padding: 0px !important;
                  min-width: 0px !important;
                `
              )}
              onClick={(e) => {
                local.menuHeight = e;
                local.render();
                // let val = dim.h;
                // if (dim.h === "fit") val = "full";
                // else if (dim.h === "full") val = activeEl?.offsetHeight || 0;
                // else val = "fit";

                // update("dim", {
                //   ...dim,
                //   h: val,
                // });
              }}
            >
              {dim.h === "full" && (
                <svg
                  className="w-[16px] h-[16px]"
                  xmlns="http://www.h3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.5 3.5h2v-1h-5v1h2v9h-2v1h5v-1h-2v-9z"
                    fill="#000"
                  ></path>
                </svg>
              )}
              {dim.h === "fit" && (
                <svg
                  xmlns="http://www.h3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.646 12.646l.708.708L8 10.707l2.646 2.646.708-.707L8 9.293l-3.354 3.354zm.708-10L8 5.294l2.646-2.647.708.708L8 6.707 4.646 3.354l.708-.707z"
                    fill="#000"
                  ></path>
                </svg>
              )}

              {dim.h !== "fit" && dim.h !== "full" && (
                <div className="w-[16px] h-[16px] flex items-center justify-center">
                  {dim.hUnit || "px"}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex border-t pt-1 mt-1 space-x-1 justify-between">
        <Button
          className={cx(css`
            height: 20px;
          `)}
          onClick={(e) => {
            update("dim", {
              ...dim,
              w: "fit",
              h: "fit",
            });
            local.toggle = !local.toggle;
            local.render();
          }}
        >
          <div className="flex flex-1 items-center justify-center text-[9px] px-1">
            FIT
          </div>
        </Button>
        <Button
          className={cx(css`
            height: 20px;
          `)}
          onClick={(e) => {
            update("dim", {
              ...dim,
              w: "full",
              h: "full",
            });
            local.toggle = !local.toggle;
            local.render();
          }}
        >
          <div className="flex flex-1 items-center justify-center text-[9px] px-1">
            FULL
          </div>
        </Button>
      </div>
    </div>
  );
};
