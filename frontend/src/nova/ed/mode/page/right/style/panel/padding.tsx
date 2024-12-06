import transform from "lodash.transform";
import uniq from "lodash.uniq";
import { FC, useEffect } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNPadding } from "utils/types/meta-fn";
import { Tooltip } from "utils/ui/tooltip";
import { responsiveVal } from "../tools/responsive-val";
import { Button } from "../ui/Button";
import { FieldNumUnit } from "../ui/FieldNumUnit";
import {
  ArrowDown,
  ArrowDown01,
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  ArrowUp01,
  ArrowUpToLine,
  MoveVertical,
} from "lucide-react";
import get from "lodash.get";

type PaddingUpdate = {
  padding: FNPadding;
};

export const PanelPadding: FC<{
  id: string;
  value: IItem;
  mode: "desktop" | "mobile";
  update: <T extends keyof PaddingUpdate>(
    key: T,
    val: PaddingUpdate[T]
  ) => void;
}> = ({ id, value, update, mode }) => {
  const detectMixed = (v: any, keys?: string[]) => {
    let data: any = v;
    let corner: any = [];
    transform(data, (r, v, k) => {
      if (keys) {
        if (keys.includes(k as string)) corner.push(v);
      } else {
        corner.push(v);
      }
    });
    let uniqueCorner = uniq(corner);
    if (uniqueCorner.length > 1) {
      return {
        isMix: true,
        value: "Mixed",
      };
    }
    return {
      isMix: false,
      value: uniqueCorner[0] + "",
    };
  };
  const local = useLocal({ id: id, all: false }, async () => {
    let mix = detectMixed(padding);
    local.all = mix.isMix;
    local.render();
  });
  const padding = responsiveVal<FNPadding>(value, "padding", mode, {
    l: 0,
    b: 0,
    t: 0,
    r: 0,
  });

  useEffect(() => {
    if (local.id !== id) {
      local.id = id;
      if (!local.all) {
        if (padding.l !== padding.r || padding.b !== padding.t) {
          local.all = true;
          local.render();
        }
      } else if (local.all) {
        if (padding.l === padding.r && padding.b === padding.t) {
          local.all = false;
          local.render();
        }
      }
    }
  }, [id]);

  const v_mix = detectMixed(padding, ["t", "b"]);
  const h_mix = detectMixed(padding, ["l", "r"]);
  const all_mix = detectMixed(padding);

  return (
    <div className="flex flex-col ml-1">
      <div className="text-[10px] select-none text-slate-400">PADDING</div>
      <div
        className={cx(
          css`
            input {
              width: 20px;
            }
          `,
          "flex items-center space-x-1"
        )}
      >
        <div>
          <FieldNumUnit
            positiveOnly
            hideUnit
            className={css`
              border: 1px solid #ccc;
              flex: 0;
            `}
            icon={
              <div className="flex pr-1 h-[20px] items-center border-r border-gray-300 mr-1">
                <ArrowLeftToLine size={12} />
              </div>
            }
            value={padding.l + "px"}
            update={(val) => {
              update("padding", {
                ...padding,
                l: parseInt(val.replaceAll("px", "")),
              });
            }}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <FieldNumUnit
            positiveOnly
            className={css`
              border: 1px solid #ccc;
            `}
            hideUnit
            icon={
              <div className="flex pr-1 h-[20px] items-center border-r border-gray-300 mr-1">
                <ArrowUpToLine size={12} />
              </div>
            }
            value={padding.t + "px"}
            update={(val) => {
              update("padding", {
                ...padding,
                t: parseInt(val.replaceAll("px", "")),
              });
            }}
          />
          <FieldNumUnit
            positiveOnly
            className={css`
              border: 1px solid #ccc;
            `}
            hideUnit
            icon={
              <div className="flex pr-1 h-[20px] items-center border-r border-gray-300 mr-1">
                <ArrowDownToLine size={12} />
              </div>
            }
            value={padding.b + "px"}
            update={(val) => {
              update("padding", {
                ...padding,
                b: parseInt(val.replaceAll("px", "")),
              });
            }}
          />
        </div>

        <div>
          <FieldNumUnit
            positiveOnly
            hideUnit
            className={css`
              border: 1px solid #ccc;
              flex: 0;
            `}
            icon={
              <div className="flex pr-1 h-[20px] items-center border-r border-gray-300 mr-1">
                <ArrowRightToLine size={12} />
              </div>
            }
            value={padding.r + "px"}
            update={(val) => {
              update("padding", {
                ...padding,
                r: parseInt(val.replaceAll("px", "")),
              });
            }}
          />
        </div>
      </div>
      <div
        className={cx(
          "flex mt-1 border-t pt-1 space-x-1",
          css`
            > .field-num {
              flex: 1;
              width: 20px;
              flex-direction: column;
              align-items: stretch !important;
              > .flex {
                width: 100%;
              }
              > .icon {
                display: flex;
                align-items: center;
                font-size: 9px;
                justify-content: center;
                height: 16px;
                border-bottom: 1px solid #ccc;
                > div {
                  margin: 0;
                  padding: 0;
                  > * {
                    margin: 0px 5px;
                  }
                }
              }
            }
            input {
              text-align: center;
              width: 100%;
            }
          `
        )}
      >
        <FieldNumUnit
          positiveOnly
          className={css`
            border: 1px solid #ccc;
          `}
          hideUnit
          icon={<>ALL</>}
          enableWhenDrag
          value={get(all_mix, "isMix") ? "" : get(all_mix, "value") + ""}
          disabled={get(all_mix, "isMix") ? "Mixed" : false}
          update={(val) => {
            update("padding", {
              ...padding,
              t: parseInt(val.replaceAll("px", "")),
              b: parseInt(val.replaceAll("px", "")),
              r: parseInt(val.replaceAll("px", "")),
              l: parseInt(val.replaceAll("px", "")),
            });
          }}
        />
        <FieldNumUnit
          positiveOnly
          className={css`
            border: 1px solid #ccc;
          `}
          hideUnit
          icon={
            <>
              <ArrowUpToLine size={9} />
              <ArrowDownToLine size={9} />
            </>
          }
          enableWhenDrag
          value={get(v_mix, "isMix") ? "" : get(v_mix, "value") + ""}
          disabled={get(v_mix, "isMix") ? "Mixed" : false}
          update={(val) => {
            update("padding", {
              ...padding,
              t: parseInt(val.replaceAll("px", "")),
              b: parseInt(val.replaceAll("px", "")),
            });
          }}
        />

        <FieldNumUnit
          positiveOnly
          className={css`
            border: 1px solid #ccc;
          `}
          hideUnit
          icon={
            <>
              <ArrowLeftToLine size={9} />
              <ArrowRightToLine size={9} />
            </>
          }
          enableWhenDrag
          value={get(h_mix, "isMix") ? "" : get(h_mix, "value") + ""}
          disabled={get(h_mix, "isMix") ? "Mixed" : false}
          update={(val) => {
            update("padding", {
              ...padding,
              l: parseInt(val.replaceAll("px", "")),
              r: parseInt(val.replaceAll("px", "")),
            });
          }}
        />
      </div>
    </div>
  );
};
