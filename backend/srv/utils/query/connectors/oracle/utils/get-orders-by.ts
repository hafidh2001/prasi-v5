import type {
  ORDER_BY,
  PQuerySelect,
  PQuerySelectCol,
  PQuerySelectRel,
} from "prasi-frontend/src/nova/ed/mode/query/types";
import type { NAME } from "utils/query/types";

export const getOrdersBy = (
  table: NAME,
  select: (PQuerySelectCol | PQuerySelectRel)[],
  order_by?: PQuerySelect["order_by"]
): string[] => {
  const result = [] as string[];

  if (order_by) {
    for (const [col, order] of Object.entries(order_by)) {
      const order_by_name = orderByName(table, col, order);
      result.push(order_by_name);
    }
  }

  for (const c of select) {
    if (c.type === "relation") {
      // Recursive call to process nested relations
      if (c.select) {
        result.push(...getOrdersBy(c.rel_name, c.select, c.order_by));
      }
    }
  }

  return result;
};

const orderByName = (table: NAME, col: NAME, order: ORDER_BY) => {
  const db_table = table.toUpperCase();
  const db_col = col.toUpperCase();
  const db_order = order.toUpperCase();

  return `${db_table}.${db_col} ${db_order}`;
};
