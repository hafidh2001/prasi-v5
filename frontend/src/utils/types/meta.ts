import {
  FNBackground,
  FNBorder,
  FNDimension,
  FNFont,
  FNPadding
} from "./meta-fn";

export type MetaItem = {
  id: string;
  originalId?: string;
  type: "text" | "section" | "item";
  name: string;
  field?: string;
  html?: string;
  text?: string;
  hidden?: "only-editor" | "all" | false;
};

export type BasicItem = {
  padding?: FNPadding;
  bg?: FNBackground;
  font?: FNFont;
  dim?: FNDimension;
  border?: FNBorder;
  typings?: string;
};
