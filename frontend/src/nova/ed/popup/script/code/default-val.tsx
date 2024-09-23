export const itemCssDefault = `\
& {
  display: flex;

  // &.mobile {}
  // &.desktop {}
  // &:hover {}
}`;

export const itemJsDefault = `\
<div {...props} className={cx(props.className, "")}>
  {children}
</div>`;
