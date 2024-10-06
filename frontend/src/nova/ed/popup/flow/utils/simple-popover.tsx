import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { FC, ReactElement } from "react";
import { useLocal } from "utils/react/use-local";

export const SimplePopover: FC<{
  content?: ReactElement;
  children: ReactElement;
  className?: string;
  disabled?: boolean;
}> = ({ content, children, className, disabled }) => {
  const local = useLocal({ open: false });
  if (disabled) return children;
  return (
    <Popover
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cx(className)}>{content}</PopoverContent>
    </Popover>
  );
};
