import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import { prasiExprStyle } from "./lib/style";
import { EExpr, EValue, PEInitProp } from "./lib/type";
import { POperator } from "./operator/prasi-opr";
import { PVar } from "./prasi-var";
import { PEString } from "./value/string";

export const PrasiExpr: FC<{ value: EExpr }> = ({ value }) => {
  return (
    <div className={cx("prasi-expr", prasiExprStyle)}>
      <PExpr expr={value} />
    </div>
  );
};

const PExpr: FC<{ expr: EExpr }> = ({ expr }) => {
  return (
    <div className={cx("expr")}>
      {expr.base.type === "expression" && <PExpr expr={expr.base} />}
      {expr.base.type === "variable" && (
        <PVar evar={expr.base}>
          {({ base, varName }) => {
            return (
              <>
                <PValue base={base} varName={varName} />
                <POperator operator={expr.operator} base={base} />
              </>
            );
          }}
        </PVar>
      )}
      {expr.base.type !== "variable" && expr.base.type !== "expression" && (
        <>
          <PValue base={expr.base} />
          <POperator operator={expr.operator} base={expr.base} />
        </>
      )}
    </div>
  );
};

const PValue: FC<{ base: EValue; className?: string; varName?: string }> = ({
  base,
  className,
  varName,
}) => {
  const local = useLocal({ focus() {}, focused: false, hovered: false });
  const init: PEInitProp = ({ focus, on }) => {
    local.focus = focus;
    on.focus = () => {
      local.focused = true;
      local.render();
    };
    on.blur = () => {
      local.focused = false;
      local.render();
    };
  };

  let renderValue = undefined;
  if (varName) {
    renderValue = (
      <div
        className={cx("evar value-content")}
        onPointerOver={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {varName}
      </div>
    );
  }

  const props = {
    init,
    renderValue,
    update: (value: any) => {},
  };
  return (
    <div
      className={cx(
        `evalue`,
        local.focused && "focused",
        local.hovered && "hovered",
        className
      )}
      onClick={() => {
        local.focus();
      }}
      onPointerOut={() => {
        local.hovered = false;
        local.render();
      }}
      onPointerOver={() => {
        local.hovered = true;
        local.render();
      }}
    >
      {base.type === "string" && <PEString base={base} {...props} />}
    </div>
  );
};
