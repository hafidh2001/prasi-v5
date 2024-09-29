"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { allNodeDefinitions } from "popup/script/flow/runtime/nodes";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "utils/shadcn/comps/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "utils/shadcn/comps/ui/popover";
import { cn } from "utils/shadcn/lib";

export function NodeTypePicker({
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
  children: (opt: {
    setOpen: (open: boolean) => void;
    open: boolean;
  }) => React.ReactElement;
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
      <PopoverTrigger asChild>{children({ setOpen, open })}</PopoverTrigger>
      <PopoverContent className={cx("w-[200px] p-0", className)}>
        <Command>
          <CommandInput
            placeholder="Search Node..."
            className={cx(
              "text-sm",
              css`
                padding: 0px;
                height: 35px;
              `,
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
                    className={cx(
                      "text-sm",
                      is_checked && "bg-blue-700 text-white ",
                    )}
                    onSelect={(currentValue) => {
                      const type = Object.entries(allNodeDefinitions).find(
                        ([k, e]) => {
                          return e.type === currentValue;
                        },
                      )?.[0] as string | undefined;

                      if (type) {
                        if (Array.isArray(value)) {
                          if (!value.includes(item.value)) {
                            setValue([...value, ...item.value] as any);
                          } else {
                            setValue(
                              value.filter((e) => e !== item.value) as any,
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
                    {item.el || item.label}
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 absolute right-0",
                        is_checked ? "opacity-100" : "opacity-0",
                      )}
                    />
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

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer py-1 select-none items-center rounded-sm px-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-blue-100 data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
