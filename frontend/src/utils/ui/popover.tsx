import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import * as React from "react";

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  offset?: number;
  onOpenChange?: (open: boolean) => void;
  onChange?: (open: boolean) => void;
  autoFocus?: boolean;
  backdrop?: boolean | "self";
  border?: string;
  root?: HTMLElement;
}

export function usePopover({
  initialOpen = false,
  placement = "bottom",
  modal,
  open: controlledOpen,
  offset: popoverOffset,
  onOpenChange: setControlledOpen,
  autoFocus = false,
  backdrop = true,
  root,
}: PopoverOptions = {}) {
  const arrowRef = React.useRef(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(typeof popoverOffset === "number" ? popoverOffset : 5),
      flip({
        fallbackAxisSideDirection: "end",
        padding: 0,
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, {});
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      backdrop,
      autoFocus,
      root,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      modal,
      labelId,
      descriptionId,
      backdrop,
      autoFocus,
      root,
    ]
  );
}

function mapPlacementSideToCSSProperty(placement: Placement) {
  const staticPosition = placement.split("-")[0];

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[staticPosition];

  return staticSide;
}
function PopoverArrow(children: any) {
  const context = usePopoverContext();
  let { x: arrowX, y: arrowY } = context.middlewareData.arrow || {
    x: 0,
    y: 0,
  };
  const staticSide = mapPlacementSideToCSSProperty(context.placement) as string;

  if (staticSide === "left") arrowX = undefined;

  return (
    <div
      className={cx(
        css`
          position: absolute;
          overflow: hidden;
          padding: 2px;
        `,
        typeof arrowX === "number" &&
          css`
            left: ${arrowX}px;
          `,
        typeof arrowY === "number" &&
          css`
            top: ${arrowY}px;
          `,
        ["top", "bottom"].includes(staticSide) &&
          css`
            width: 16px;
            height: 5px;
          `,
        ["left", "right"].includes(staticSide) &&
          css`
            height: 16px;
            width: 5px;
          `,
        "flex items-start justify-start"
      )}
      style={{ [staticSide]: "-5px" }}
      ref={context.arrowRef}
    >
      <div
        style={{
          transform: "rotate(45deg)",
          position: "absolute",
        }}
        className={cx(
          "arrow",
          css`
            pointer-events: none;
            width: 10px;
            height: 10px;
            background: white;
          `,
          staticSide === "right" &&
            css`
              left: -7px;
            `,
          staticSide === "bottom" &&
            css`
              top: -7px;
            `
        )}
      />
    </div>
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
};

export function Popover({
  children,
  content,
  className,
  modal = false,
  popoverClassName,
  arrow,
  border = "1px solid black",
  onChange,
  ...restOptions
}: {
  className?: string;
  root?: HTMLElement;
  popoverClassName?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  arrow?: boolean;
  asChild?: boolean;
} & PopoverOptions) {
  const popover = usePopover({ modal, ...restOptions });
  const last = React.useRef({ open: popover.open });
  let _content = content;
  if (!content) _content = <div className={"w-[300px] h-[150px]"}></div>;

  if (onChange) {
    React.useEffect(() => {
      if (popover.open !== last.current.open) {
        last.current.open = popover.open;
        onChange(popover.open);
      }
    }, [popover.open]);
  }

  return (
    <PopoverContext.Provider value={popover}>
      <PopoverTrigger
        asChild={restOptions.asChild}
        className={className}
        onClick={
          typeof restOptions.open !== "undefined"
            ? () => {
                popover.setOpen(!popover.open);
              }
            : undefined
        }
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={cx(
          popoverClassName
            ? popoverClassName
            : css`
                background: white;
                padding: 3px 8px;
                box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
                font-size: 12px;
                user-select: none;
              `,
          border &&
            css`
              border: ${border};
              background: white;
              padding: 0px;
              .arrow {
                border: ${border};
              }
            `
        )}
      >
        {_content}
        {(typeof arrow === "undefined" || arrow) && <PopoverArrow />}
      </PopoverContent>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      })
    );
  }

  return (
    <div
      ref={ref}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props as any)}
    >
      {children}
    </div>
  );
});

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  const _content = (
    <div
      ref={ref}
      style={{
        ...context.floatingStyles,
        ...props.style,
      }}
      aria-labelledby={context.labelId}
      aria-describedby={context.descriptionId}
      {...context.getFloatingProps(props as any)}
    >
      {props.children}
    </div>
  );

  const content = context.autoFocus ? (
    <FloatingFocusManager context={floatingContext} modal={context.modal}>
      {_content}
    </FloatingFocusManager>
  ) : (
    _content
  );

  return (
    <FloatingPortal root={context.root}>
      {context.backdrop ? (
        <FloatingOverlay lockScroll>{content}</FloatingOverlay>
      ) : (
        content
      )}
    </FloatingPortal>
  );
});

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading({ children, ...props }, ref) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  );
});

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function PopoverDescription({ children, ...props }, ref) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  );
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});
