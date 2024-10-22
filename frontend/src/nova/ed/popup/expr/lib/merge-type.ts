import { EType } from "popup/vars/lib/type";
import { isTypeEqual } from "./is-type-equal";
import { EDeepType } from "./types";
import { simplifyType } from "./infer-type";

export const mergeType = (type1: EType, type2: EType): EDeepType[] => {
  if (isTypeEqual(type1, type2)) {
    return [{ simple: simplifyType(type1), type: type1 }];
  }

  return [
    { simple: simplifyType(type1), type: type1 },
    { simple: simplifyType(type2), type: type2 },
  ];
};
