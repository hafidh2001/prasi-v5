import { Popover } from "utils/ui/popover";
import { EdTypeLabel } from "../lib/type-label";
import { getBaseType } from "../lib/validate";

export const definePickerPopup = (
  local: {
    open: boolean;
    render: () => void;
  },
  base_type: string,
  onChange: (type: any) => void
) => {
  return ({
    children,
    className,
    onClick,
  }: {
    className: string;
    children: any;
    onClick?: () => void;
  }) => (
    <div className={className} onClick={onClick}>
      <Popover
        open={local.open}
        onOpenChange={(open) => {
          local.open = open;
          local.render();
        }}
        asChild
        backdrop={false}
        border="1px solid black"
        className="flex-1 flex flex-col items-stretch"
        content={
          <>
            {["string", "number", "boolean", {}, [], "null"].map((t, idx) => {
              const item_type = getBaseType(t);

              let is_active = item_type === base_type;

              return (
                <div
                  key={idx}
                  className={cx(
                    "p-1 pt-1 pr-2 cursor-pointer",
                    css`
                      .text {
                        margin-left: 5px;
                      }
                    `,
                    is_active
                      ? "bg-green-600 text-white"
                      : "hover:bg-blue-600 hover:text-white"
                  )}
                  onClick={(e) => {
                    if (t) {
                      e.stopPropagation();
                      e.preventDefault();
                      local.open = false;
                      local.render();
                      onChange(t);
                    }
                  }}
                >
                  <EdTypeLabel type={t} show_label />
                </div>
              );
            })}
          </>
        }
      >
        {children}
      </Popover>
    </div>
  );
};
