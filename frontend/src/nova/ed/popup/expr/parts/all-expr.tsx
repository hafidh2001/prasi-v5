import _if from "../list/condition/if";
import _and from "../list/condition/and";
import _is_exists from "../list/condition/is-exists";
import _or from "../list/condition/or";
import { PExprDefinition } from "../lib/types";

export const allExpression = [_if, _is_exists, _and, _or];

export const getExpressionDefinition = (name: string) => {
  const def = allExpression.find((e) => e.name === name);
  return def as PExprDefinition<any>;
};
