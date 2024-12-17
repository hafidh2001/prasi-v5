import { Asterisk, Square, SquareCheckBig } from "lucide-react";
import { QInspectRelation, QInspectResult } from "prasi-srv/utils/query/types";
import { FC } from "react";
import { PQuerySelect } from "./types";

export const ColumnDetail: FC<{
  inspect: QInspectResult;
  select: PQuerySelect["select"];
  table_name: string;
  onSelectChanged: (new_select: PQuerySelect["select"]) => void;
  onExpandRelation: (relation_name: string, relation: QInspectRelation) => void;
}> = ({
  inspect,
  select = [],
  table_name,
  onSelectChanged,
  onExpandRelation,
}) => {
  const table = inspect.tables[table_name];

  if (!table) return null;

  const selected_names = select.map((item) => {
    if (item.type === "column") {
      return item.col_name;
    } else {
      return item.rel_name;
    }
  });

  const convert_type_relation = (rel_type: QInspectRelation["type"]) => {
    switch (rel_type) {
      case "many-to-one":
        return "N-1";
      case "one-to-many":
        return "1-N";
      case "one-to-one":
        return "1-1";
      default:
        return rel_type;
    }
  };

  return (
    <div
      key={table.name}
      className="relative border-r border-l bg-white min-w-[250px] h-full"
    >
      <div className="flex justify-between items-center border-b px-2 bg-gray-100">
        <span className="text-xs font-bold">{table.name}</span>

        <button className="border rounded-sm px-1 bg-white hover:bg-blue-500 hover:text-white">
          <span className="text-xs">Where</span>
        </button>
      </div>
      <div className="">
        {Object.entries(table.columns).map(([column_name, column]) => {
          let is_checked = selected_names.includes(column_name);

          // find relation
          const relation_found = Object.entries(table.relations).find(
            ([name, rel]) => rel.from.column === column_name
          );
          const relation = relation_found?.[1];
          const relation_name = relation_found?.[0];

          return (
            <div
              key={column_name}
              className="flex items-center cursor-pointer justify-between border-b px-2 h-[24px] hover:bg-blue-100"
              onClick={() => {
                let new_select = [...select] as PQuerySelect["select"];

                if (is_checked) {
                  new_select = new_select.filter((item) => {
                    if (item.type === "column") {
                      if (item.col_name === column_name) {
                        return false;
                      }
                    }

                    return true;
                  });
                } else {
                  new_select.push({
                    col_name: column_name,
                    type: "column",
                  });
                }

                onSelectChanged(new_select);
              }}
            >
              <div className="flex flex-1 items-center">
                <span className="mr-1">
                  {is_checked ? (
                    <SquareCheckBig size={12} />
                  ) : (
                    <Square size={12} />
                  )}
                </span>
                <span className="text-xs">{column_name}</span>
                <span className="ml-1 text-sm font-bold text-red-400">
                  {column.nullable ? null : <Asterisk size={11} />}
                </span>
                {column.is_pk
                  ? null
                  : relation && (
                      <span className="ml-1 text-xs text-blue-400">
                        {relation_name}
                      </span>
                    )}
              </div>
              <div className="flex">
                {column.is_pk && (
                  <span className="mr-1 text-blue-600 text-xs">🔑</span>
                )}
                <span className="text-xs text-gray-500">{column.type}</span>
              </div>
            </div>
          );
        })}

        {Object.keys(table.relations).length > 0 && (
          <div>
            {Object.entries(table.relations).map(
              ([relation_name, relation_inspect]) => {
                const is_checked = selected_names.includes(relation_name);

                return (
                  <div
                    key={relation_name}
                    className="w-full border-b h-[24px] flex items-center px-2 cursor-pointer text-left hover:bg-blue-100"
                    onClick={() => {
                      onExpandRelation(relation_name, relation_inspect);
                    }}
                  >
                    <span className="mr-1">
                      {is_checked ? (
                        <SquareCheckBig size={12} />
                      ) : (
                        <Square size={12} />
                      )}
                    </span>
                    <span className="text-xs flex-1">{relation_name}</span>
                    <span className="text-xs text-gray-500">
                      {convert_type_relation(relation_inspect.type)}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
