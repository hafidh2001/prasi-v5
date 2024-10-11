import { ReactElement } from "react";
import { definePickerPopup } from "../picker/picker-popup";
import { EdPickerRename } from "../picker/picker-rename";

export type EType = ESimpleType | EArrayType | EObjectType;
export type ESimpleType = "string" | "number" | "boolean" | "null";
export type EBaseType = ESimpleType | "array" | "object";
export type EArrayType = [EType];
export type EObjectType = {
  [K in string]: EObjectEntry;
};
export type EObjectEntry = { type: EType; idx: number; optional?: boolean };

export type EVChildren = (arg: {
  open: () => void;
  type: EType;
  Item: ReturnType<typeof definePickerPopup>;
  depth: number;
  name?: string;
  path: string[];
  value: any;
  valuePath: string[];
  children: any;
  markChanged: (path: string[]) => void;
}) => ReactElement;
