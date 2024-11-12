import { DeepReadonly } from "popup/flow/runtime/types";
import { FC } from "react";
import { IItem } from "utils/types/item";

export const createViLoop = (item: DeepReadonly<IItem>) => {
  return (arg: { list: any }) => {
    return <></>;
  };
};
