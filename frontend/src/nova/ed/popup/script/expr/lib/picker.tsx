import { FC } from "react";
import { useLocal } from "utils/react/use-local";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "utils/shadcn/comps/ui/command";
import { Popover } from "utils/ui/popover";

export const ExprPicker: FC<{ className: string; children: any }> = ({
  className,
  children,
}) => {
  return (
    <Popover
      backdrop={false}
      className={className}
      popoverClassName={cx(css`
        padding: 0px;
        user-select: none;

        box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-family: "Liga Menlo", monospace;

        [cmdk-group-heading] {
          padding: 2px 4px;
          font-size: 0.7em;
        }
        [cmdk-group-items] {
          & > div {
            padding: 2px 4px;
            font-size: 0.8em;
          }
        }
        border: 1px solid #ccc;
        .arrow {
          border: 1px solid #ccc;
        }
      `)}
      content={
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      }
    >
      {children}
    </Popover>
  );
};
