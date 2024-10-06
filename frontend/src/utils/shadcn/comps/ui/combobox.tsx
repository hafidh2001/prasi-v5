"use client";

import { Check } from "lucide-react";
import { allNodeDefinitions } from "popup/script/flow/runtime/nodes";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "utils/shadcn/comps/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "utils/shadcn/comps/ui/popover";
import { cn } from "utils/shadcn/lib";

export function Combobox({
  options,
  children,
  onChange,
  defaultValue,
  className,
  onOpenChange,
}: {
  className?: string;
  options: (
    | { value: string; label: string; el?: React.ReactElement }
    | string
  )[];
  onChange: (value: string) => void;
  defaultValue: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const _options = options.map((e) => {
    if (typeof e === "string") return { label: e, value: e };
    return e;
  });

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        onOpenChange?.(value);
        setOpen(value);
      }}
    >
      <PopoverTrigger asChild>{children }</PopoverTrigger>
      <PopoverContent className={cx("w-[200px] p-0", className)}>
        <Command>
          <CommandInput
            placeholder="Search..."
            className={cx(
              "text-sm",
              css`
                padding: 0px;
                height: 35px;
              `
            )}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {_options.map((item) => {
                const is_checked = Array.isArray(value)
                  ? value.includes(item.value)
                  : value === item.value;

                return (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    className="text-sm"
                    onSelect={(currentValue) => {
                      const type = Object.entries(allNodeDefinitions).find(
                        ([k, e]) => {
                          return e.type === currentValue;
                        }
                      )?.[0] as string | undefined;

                      if (type) {
                        if (Array.isArray(value)) {
                          if (!value.includes(item.value)) {
                            setValue([...value, ...item.value] as any);
                          } else {
                            setValue(
                              value.filter((e) => e !== item.value) as any
                            );
                          }
                        } else {
                          setValue(type === value ? "" : type);
                          setOpen(false);
                        }

                        onChange(type);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        is_checked ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.el || item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
