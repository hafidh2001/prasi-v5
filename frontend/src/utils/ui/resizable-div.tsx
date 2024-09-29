import React from "react";

export const ResizableDiv = function ResizableDiv(props: {
  onChange: (dx: number) => void;
}) {
  const { onChange = () => null, ...otherProps } = props;

  const resizeRef = React.useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = React.useState(false);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      setResizing(true);
      event.preventDefault();
      function handlePointerMove(event: PointerEvent) {
        event.preventDefault();
        window.requestAnimationFrame(() => {
          const rect = resizeRef.current!.getBoundingClientRect();
          onChange?.(event.x - rect.x);
        });
      }
      function handlePointerUp() {
        setResizing(false);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      }
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [onChange],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 0,
        flexGrow: 0,
        zIndex: 1,
        top: 0,
        bottom: 0,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          cursor: "col-resize",
          height: "100%",
          width: "4px",
          marginLeft: "-2px",
        }}
        onPointerDown={handlePointerDown}
        ref={resizeRef}
        {...otherProps}
      />
    </div>
  );
};
