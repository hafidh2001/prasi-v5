import get from "lodash.get";
import transform from "lodash.transform";
import uniq from "lodash.uniq";
import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNBorder } from "utils/types/meta-fn";
import { Dropdown } from "utils/ui/dropdown";
import { Tooltip } from "utils/ui/tooltip";
import { responsiveVal } from "../tools/responsive-val";
import { FieldColor } from "../ui/FieldColor";
import { FieldNumUnit } from "../ui/FieldNumUnit";
import { dropdownProp } from "../ui/style";

type BorderUpdate = {
  border: FNBorder;
};
export const PanelBorder: FC<{
  value: IItem;
  mode: "desktop" | "mobile";
  update: <T extends keyof BorderUpdate>(key: T, val: BorderUpdate[T]) => void;
}> = ({ value, update, mode }) => {
  const params = responsiveVal<FNBorder>(value, "border", mode, {
    style: "solid",
  });
  const detectMixed = (round: any) => {
    let rounded: any = round;
    let corner: any = [];
    transform(rounded, (r, v, k) => {
      corner.push(v);
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
  const updateAllCorner = (props: { value: number }) => {
    const { value } = props;
    update("border", {
      ...params,
      rounded: {
        tr: value,
        tl: value,
        bl: value,
        br: value,
      } as any,
    });
    return {
      tr: value,
      tl: value,
      bl: value,
      br: value,
    };
  };
  const local = useLocal(
    {
      colorOpen: false,
      isMix: false,
      isBorderMix: false,
      open: false,
      corner: null as any,
      borderVal: null as any,
      ready: false,
      border: false,
    },
    async () => {
      let isMixed = detectMixed(params.rounded);
      local.isMix = isMixed.isMix;

      if (isMixed.isMix) local.open = true;
      let mixStroke = detectMixed(params.stroke);
      local.isBorderMix = mixStroke.isMix;

      if (mixStroke.isMix) local.border = true;
      local.render();
    }
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className={cx("flex flex-row text-xs space-x-1")}>
        <div
          className={cx(
            "flex flex-col space-y-1 max-w-[60px]",
            css`
              .dropdown {
                overflow: hidden;
              }
            `
          )}
        >
          <Tooltip content={"Background Size"}>
            <Dropdown
              {...dropdownProp}
              value={params.style}
              items={[
                { value: "solid", label: "Solid" },
                { value: "dash", label: "Dash" },
              ]}
              onChange={(val) => {
                update("border", { ...params, style: val as any });
              }}
            />
          </Tooltip>
          <Tooltip content={"Stroke"} asChild>
            <div
              className={cx(
                "bg-white p-[2px] border border-gray-300 flex items-stretch",
                css`
                  input {
                    width: 100% !important;
                  }
                  .field-num {
                    width: 60px !important;
                  }
                `
              )}
            >
              <FieldNumUnit
                positiveOnly
                hideUnit
                icon={
                  <div className="text-lg text-gray-700 mr-1">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="7"
                        y="5.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="3.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="13.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="1.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="13"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="5"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="3"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="9"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="11"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="9.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="7"
                        y="11.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <rect
                        x="1"
                        y="7.025"
                        width="1"
                        height="1"
                        rx=".5"
                        fill="currentColor"
                      ></rect>
                      <path
                        d="M1 1.49994C1 1.2238 1.22386 0.999939 1.5 0.999939H6V1.99994H2V5.99994H1V1.49994ZM13 1.99994H9V0.999939H13.5C13.7761 0.999939 14 1.2238 14 1.49994V5.99994H13V1.99994ZM1 13.4999V8.99994H2V12.9999H6V13.9999H1.5C1.22386 13.9999 1 13.7761 1 13.4999ZM13 12.9999V8.99994H14V13.4999C14 13.7761 13.7761 13.9999 13.5 13.9999H9.5V12.9999H13Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                }
                value={
                  get(detectMixed(params.stroke), "isMix")
                    ? ""
                    : get(detectMixed(params.stroke), "value") + ""
                }
                enableWhenDrag
                disabled={
                  get(detectMixed(params.stroke), "isMix") ? "Mixed" : false
                }
                update={(val) => {
                  let value = parseInt(val.replaceAll("px", ""));
                  let data = {
                    t: value,
                    b: value,
                    l: value,
                    r: value,
                  };
                  update("border", {
                    ...params,
                    stroke: data,
                  });
                  local.isBorderMix = false;

                  local.render();
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div className="flex flex-1 justify-center">
          <div
            className={cx(
              "flex flex-row text-xs items-center pl-2",

              css`
                .field-num {
                  border: 1px solid #d1d1d1;
                  height: 25px;
                  width: 45px !important;
                  margin-right: 5px;
                  margin-bottom: 5px;
                }
              `
            )}
          >
            <Tooltip asChild content="Border Left">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M3.5 21a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v16a1 1 0 0 1-1 1Z"
                        />
                        <circle
                          cx="7.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="11.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="15.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="19.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="7.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="11.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="15.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="19.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="19.5"
                          cy="8"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="19.5"
                          cy="16"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="11.5"
                          cy="8"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="11.5"
                          cy="16"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="7.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="11.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="15.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="19.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "stroke.l") + "px"}
                  update={(val) => {
                    let data = {
                      ...params.stroke,
                      l: parseInt(val.replaceAll("px", "")),
                    };
                    update("border", {
                      ...params,
                      stroke: data as any,
                    });
                    let isMixed = detectMixed(data);
                    local.isBorderMix = isMixed.isMix;
                    local.borderVal = isMixed.value;
                    local.render();
                  }}
                />
              </div>
            </Tooltip>

            <div className="flex flex-col">
              <Tooltip asChild content="Border Top">
                <div>
                  <FieldNumUnit
                    positiveOnly
                    hideUnit
                    icon={
                      <div className="text-lg text-gray-700">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="currentColor"
                            d="M20 4.5H4a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2Z"
                          />
                          <circle
                            cx="12"
                            cy="7.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="11.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="15.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="19.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="7.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="11.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="15.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="19.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="16"
                            cy="19.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="8"
                            cy="19.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="16"
                            cy="11.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="8"
                            cy="11.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="7.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="11.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="15.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="19.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                        </svg>
                      </div>
                    }
                    value={get(params, "stroke.t") + "px"}
                    update={(val) => {
                      let data = {
                        ...params.stroke,
                        t: parseInt(val.replaceAll("px", "")),
                      };
                      update("border", {
                        ...params,
                        stroke: data as any,
                      });
                      let isMixed = detectMixed(data);
                      local.isBorderMix = isMixed.isMix;
                      local.borderVal = isMixed.value;
                      local.render();
                    }}
                  />
                </div>
              </Tooltip>
              <Tooltip asChild content="Border Bottom">
                <div>
                  <FieldNumUnit
                    positiveOnly
                    hideUnit
                    icon={
                      <div className="text-lg text-gray-700">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="currentColor"
                            d="M20 21.5H4a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2Z"
                          />
                          <circle
                            cx="12"
                            cy="16.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="12.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="8.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="12"
                            cy="4.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="16.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="12.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="8.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="4"
                            cy="4.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="8"
                            cy="4.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="16"
                            cy="4.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="8"
                            cy="12.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="16"
                            cy="12.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="16.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="12.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="8.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                          <circle
                            cx="20"
                            cy="4.5"
                            r="1"
                            fill="currentColor"
                            opacity=".5"
                          />
                        </svg>
                      </div>
                    }
                    value={get(params, "stroke.b") + "px"}
                    update={(val) => {
                      let data = {
                        ...params.stroke,
                        b: parseInt(val.replaceAll("px", "")),
                      };
                      update("border", {
                        ...params,
                        stroke: data as any,
                      });
                      let isMixed = detectMixed(data);
                      local.isBorderMix = isMixed.isMix;
                      local.borderVal = isMixed.value;
                      local.render();
                    }}
                  />
                </div>
              </Tooltip>
            </div>
            <Tooltip asChild content="Border Right">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M20.5 21a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v16a1 1 0 0 1-1 1Z"
                        />
                        <circle
                          cx="16.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="12.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="8.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="4.5"
                          cy="12"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="16.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="12.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="8.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="4.5"
                          cy="20"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="4.5"
                          cy="16"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="4.5"
                          cy="8"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="12.5"
                          cy="16"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="12.5"
                          cy="8"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="16.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="12.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="8.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                        <circle
                          cx="4.5"
                          cy="4"
                          r="1"
                          fill="currentColor"
                          opacity=".5"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "stroke.r") + "px"}
                  update={(val) => {
                    let data = {
                      ...params.stroke,
                      r: parseInt(val.replaceAll("px", "")),
                    };
                    update("border", {
                      ...params,
                      stroke: data as any,
                    });
                    let isMixed = detectMixed(data);
                    local.isBorderMix = isMixed.isMix;
                    local.borderVal = isMixed.value;
                    local.render();
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="text-[10px] select-none text-slate-400">
        COLOR & ROUNDED CORNER
      </div>

      <div
        className={cx(
          "flex flex-row items-stretch text-xs ",
          css`
            .field-num {
              border: 1px solid #d1d1d1;
            }
          `
        )}
      >
        <div className="flex flex-col space-y-1 mr-3">
          <Tooltip asChild content={"Border Color"}>
            <div
              className={cx(
                "bg-white p-[2px] border border-gray-300 flex items-center justify-center",
                css`
                  .color-box {
                    height: 22px !important;
                    width: 50px;
                  }
                `
              )}
            >
              <FieldColor
                popupID="border-color"
                value={params.color}
                update={(color) => {
                  update("border", { ...params, color });
                }}
              />
            </div>
          </Tooltip>
          <Tooltip content="Corner">
            <div
              className={cx(css`
                width: 55px;
                height: 23px;
              `)}
            >
              <FieldNumUnit
                positiveOnly
                hideUnit
                icon={
                  <div className="text-lg text-gray-700">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M19 19h2v2h-2v-2zm0-2h2v-2h-2v2zM3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm0-4h2V3H3v2zm4 0h2V3H7v2zm8 16h2v-2h-2v2zm-4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8 0h2v-2H7v2zm-4 0h2v-2H3v2zM21 8c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v5h2V8z"
                      />
                    </svg>
                  </div>
                }
                width={"100%"}
                enableWhenDrag
                value={
                  get(detectMixed(params.rounded), "isMix")
                    ? ""
                    : get(detectMixed(params.rounded), "value") + ""
                }
                disabled={
                  get(detectMixed(params.rounded), "isMix") ? "Mixed" : false
                }
                update={(val, setVal) => {
                  let result = updateAllCorner({
                    value: parseInt(val.replaceAll("px", "")),
                  });
                  let isMixed = detectMixed(result);
                  local.isMix = isMixed.isMix;

                  local.render();
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div className="flex flex-1 justify-center">
          <div
            className={cx(
              "flex flex-row text-xs flex-wrap",
              css`
                width: 100px;

                .field-num {
                  height: 25px;
                  border: 1px solid #d1d1d1;
                  margin-right: 5px;
                  margin-bottom: 5px;
                }
              `
            )}
          >
            <Tooltip asChild content="Corner Top Left">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  className={css`
                    border-top-left-radius: 8px;
                  `}
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="m4 16.01l.01-.011M4 20.01l.01-.011M8 20.01l.01-.011m3.99.011l.01-.011m3.99.011l.01-.011m3.99.011l.01-.011M20 16.01l.01-.011M20 12.01l.01-.011M20 8.01l.01-.011M20 4.01l.01-.011M16 4.01l.01-.011M4 12V4h8v8H4Z"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "rounded.tl") + "px"}
                  update={(val) => {
                    update("border", {
                      ...params,
                      rounded: {
                        ...params.rounded,
                        tl: parseInt(val.replaceAll("px", "")),
                      } as any,
                    });
                    let isMixed = detectMixed({
                      ...params.rounded,
                      tl: parseInt(val.replaceAll("px", "")),
                    });
                    local.isMix = isMixed.isMix;

                    local.render();
                  }}
                />
              </div>
            </Tooltip>

            <Tooltip asChild content="Corner Top Right">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  className={css`
                    border-top-right-radius: 8px;
                  `}
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="m20.01 16.01l-.01-.011m.01 4.011l-.01-.011m-3.99.011l-.01-.011m-3.99.011l-.01-.011m-3.99.011L8 19.999m-3.99.011L4 19.999m.01-3.989L4 15.999m.01-3.989L4 11.999m.01-3.989L4 7.999m.01-3.989L4 3.999m4.01.011L8 3.999M20.01 12V4h-8v8h8Z"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "rounded.tr") + "px"}
                  update={(val) => {
                    update("border", {
                      ...params,
                      rounded: {
                        ...params.rounded,
                        tr: parseInt(val.replaceAll("px", "")),
                      } as any,
                    });
                    let isMixed = detectMixed({
                      ...params.rounded,
                      tr: parseInt(val.replaceAll("px", "")),
                    });
                    local.isMix = isMixed.isMix;

                    local.render();
                  }}
                />
              </div>
            </Tooltip>

            <Tooltip asChild content="Corner Bottom Left">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  className={css`
                    border-bottom-left-radius: 8px;
                  `}
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="m4 8l.01.011M4 4l.01.011M8 4l.01.011M12 4l.01.011M16 4l.01.011M20 4l.01.011M20 8l.01.011M20 12l.01.011M20 16l.01.011M20 20l.01.011M16 20l.01.011M4 12.01v8h8v-8H4Z"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "rounded.bl") + "px"}
                  update={(val) => {
                    update("border", {
                      ...params,
                      rounded: {
                        ...params.rounded,
                        bl: parseInt(val.replaceAll("px", "")),
                      } as any,
                    });
                    let isMixed = detectMixed({
                      ...params.rounded,
                      bl: parseInt(val.replaceAll("px", "")),
                    });
                    local.isMix = isMixed.isMix;

                    local.render();
                  }}
                />
              </div>
            </Tooltip>

            <Tooltip asChild content="Corner Bottom Right">
              <div>
                <FieldNumUnit
                  positiveOnly
                  hideUnit
                  className={css`
                    border-bottom-right-radius: 8px;
                  `}
                  icon={
                    <div className="text-lg text-gray-700">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="m20.01 8l-.01.011M20.01 4l-.01.011M16.01 4l-.01.011M12.01 4l-.01.011M8.01 4L8 4.011M4.01 4L4 4.011M4.01 8L4 8.011M4.01 12l-.01.011M4.01 16l-.01.011M4.01 20l-.01.011M8.01 20l-.01.011m12.01-8.001v8h-8v-8h8Z"
                        />
                      </svg>
                    </div>
                  }
                  value={get(params, "rounded.br") + "px"}
                  update={(val) => {
                    update("border", {
                      ...params,
                      rounded: {
                        ...params.rounded,
                        br: parseInt(val.replaceAll("px", "")),
                      } as any,
                    });
                    let isMixed = detectMixed({
                      ...params.rounded,
                      br: parseInt(val.replaceAll("px", "")),
                    });
                    local.isMix = isMixed.isMix;

                    local.render();
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
