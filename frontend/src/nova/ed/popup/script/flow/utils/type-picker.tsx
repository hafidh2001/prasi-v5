"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { allNodeDefinitions } from "popup/script/flow/runtime/nodes";
import * as React from "react";

import { useLocal } from "utils/react/use-local";
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
import { PFNodeDefinition } from "../runtime/types";
import { NodeTypeLabel } from "./node-type-label";

export const NodeTypePicker: React.FC<{
  value: keyof typeof allNodeDefinitions;
  onChange: (value: keyof typeof allNodeDefinitions) => void;
  name?: string;
  defaultOpen?: boolean;
  children?:
    | React.ReactElement
    | ((opt: { setOpen: (open: boolean) => void; open: boolean }) => any);
}> = ({ value, onChange, children, name, defaultOpen }) => {
  const local = useLocal({ open: defaultOpen || false, onChangeCalled: false });

  const setOpen = (open: boolean) => {
    if (!open) {
      if (!local.onChangeCalled) {
        onChange(value);
      } else {
        local.onChangeCalled = false;
      }
    }
    local.open = open;
    local.render();
  };

  return (
    <PFDropdown
      open={local.open}
      name={name}
      setOpen={setOpen}
      options={Object.keys(allNodeDefinitions)
        .filter((e) => e !== "start")
        .map((e) => {
          const def = (allNodeDefinitions as any)[e] as PFNodeDefinition<any>;
          return {
            value: e,
            label: def.type,
            el: (
              <>
                <div
                  className={css`
                    svg {
                      width: 12px;
                      height: 12px;
                      margin-right: 5px;
                    }
                  `}
                  dangerouslySetInnerHTML={{ __html: def.icon }}
                ></div>

                <NodeTypeLabel node={def} />
              </>
            ),
          };
        })}
      defaultValue={value}
      onChange={(value) => {
        local.onChangeCalled = true;
        onChange(value as any);
      }}
    >
      {typeof children === "object"
        ? children
        : typeof children === "function" &&
          children({
            open: local.open,
            setOpen,
          })}
    </PFDropdown>
  );
};

export function PFDropdown({
  options,
  children,
  onChange,
  defaultValue,
  className,
  name,
  open,
  setOpen,
}: {
  open: boolean;
  className?: string;
  name?: string;
  options: (
    | { value: string; label: string; el?: React.ReactElement }
    | string
  )[];
  onChange: (value: string) => void;
  defaultValue: string;
  children?: React.ReactElement;
  setOpen: (open: boolean) => void;
}) {
  const [_value, setValue] = React.useState(defaultValue);

  const _options = options.map((e) => {
    if (typeof e === "string") return { label: e, value: e };
    return e;
  });

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      {children && <PopoverTrigger asChild>{children}</PopoverTrigger>}
      <PopoverContent className={cx("w-[200px] p-0", className)}>
        <Command>
          <CommandInput
            placeholder="Search Node..."
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
                const is_checked = Array.isArray(_value)
                  ? _value.includes(item.value)
                  : _value === item.value;

                return (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    className={cx(
                      "text-sm",
                      is_checked && "bg-blue-700 text-white "
                    )}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onSelect={(currentValue) => {
                      const type = Object.entries(allNodeDefinitions).find(
                        ([k, e]) => {
                          return e.type === currentValue;
                        }
                      )?.[0] as string | undefined;

                      if (type) {
                        if (Array.isArray(_value)) {
                          if (!_value.includes(item.value)) {
                            setValue([..._value, ...item.value] as any);
                          } else {
                            setValue(
                              _value.filter((e) => e !== item.value) as any
                            );
                          }
                        } else {
                          setValue(type === _value ? "" : type);
                        }

                        onChange(type);
                        setOpen(false);
                      }
                    }}
                  >
                    {item.el || item.label}
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 absolute right-0",
                        is_checked ? "opacity-100" : "opacity-0"
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
      className
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
        className
      )}
      {...props}
    />
  </div>
));
