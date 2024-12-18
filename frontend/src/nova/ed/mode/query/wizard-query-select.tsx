import { QInspectResult } from 'prasi-srv/utils/query/types';
import { FC } from 'react';
import { useLocal } from 'utils/react/use-local';
import { ColumnDetail } from './column-detail';
import { PQuerySelect, PQuerySelectRel, TABLE_NAME } from './types';

export const WizardQuerySelect: FC = () => {
  const local = useLocal({
    inspect: {
      tables: {
        photo: {
          name: "photo",
          pk: ["photo_id"],
          db_name: "PHOTO",
          fk: {
            user_id: {
              from: "user_id",
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
          },
          columns: {
            photo_id: {
              name: "photo_id",
              db_name: "PHOTO_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: true,
            },
            user_id: {
              name: "user_id",
              db_name: "USER_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: false,
            },
            photo_url: {
              name: "photo_url",
              db_name: "PHOTO_URL",
              db_type: "VARCHAR2",
              nullable: false,
              type: "string",
              is_pk: false,
            },
            description: {
              name: "description",
              db_name: "DESCRIPTION",
              db_type: "VARCHAR2",
              nullable: true,
              type: "string",
              is_pk: false,
            },
            created_at: {
              name: "created_at",
              db_name: "CREATED_AT",
              db_type: "TIMESTAMP(6)",
              nullable: true,
              type: "string",
              is_pk: false,
            },
          },
          relations: {
            user_table: {
              type: "many-to-one",
              from: {
                table: "photo",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
            comment_table: {
              type: "one-to-many",
              from: {
                table: "comment_table",
                column: "photo_id",
              },
              to: {
                table: "photo",
                column: "photo_id",
              },
            },
          },
        },
        user_table: {
          name: "user_table",
          pk: ["user_id"],
          db_name: "USER_TABLE",
          fk: {
            role_id1: {
              from: "role_id1",
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
            role_id2: {
              from: "role_id2",
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
          },
          columns: {
            user_id: {
              name: "user_id",
              db_name: "USER_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: true,
            },
            username: {
              name: "username",
              db_name: "USERNAME",
              db_type: "VARCHAR2",
              nullable: false,
              type: "string",
              is_pk: false,
            },
            email: {
              name: "email",
              db_name: "EMAIL",
              db_type: "VARCHAR2",
              nullable: false,
              type: "string",
              is_pk: false,
            },
            created_at: {
              name: "created_at",
              db_name: "CREATED_AT",
              db_type: "TIMESTAMP(6)",
              nullable: true,
              type: "string",
              is_pk: false,
            },
            role_id1: {
              name: "role_id1",
              db_name: "ROLE_ID1",
              db_type: "NUMBER",
              nullable: true,
              type: "number",
              is_pk: false,
            },
            role_id2: {
              name: "role_id2",
              db_name: "ROLE_ID2",
              db_type: "NUMBER",
              nullable: true,
              type: "number",
              is_pk: false,
            },
          },
          relations: {
            role_table1: {
              type: "many-to-one",
              from: {
                table: "user_table",
                column: "role_id1",
              },
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
            role_table2: {
              type: "many-to-one",
              from: {
                table: "user_table",
                column: "role_id2",
              },
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
            comment_table: {
              type: "one-to-many",
              from: {
                table: "comment_table",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
            role_table: {
              type: "one-to-many",
              from: {
                table: "role_table",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
            photo: {
              type: "one-to-many",
              from: {
                table: "photo",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
          },
        },
        comment_table: {
          name: "comment_table",
          pk: ["comment_id"],
          db_name: "COMMENT_TABLE",
          fk: {
            photo_id: {
              from: "photo_id",
              to: {
                table: "photo",
                column: "photo_id",
              },
            },
            user_id: {
              from: "user_id",
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
          },
          columns: {
            comment_id: {
              name: "comment_id",
              db_name: "COMMENT_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: true,
            },
            photo_id: {
              name: "photo_id",
              db_name: "PHOTO_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: false,
            },
            user_id: {
              name: "user_id",
              db_name: "USER_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: false,
            },
            comment_text: {
              name: "comment_text",
              db_name: "COMMENT_TEXT",
              db_type: "VARCHAR2",
              nullable: false,
              type: "string",
              is_pk: false,
            },
            created_at: {
              name: "created_at",
              db_name: "CREATED_AT",
              db_type: "TIMESTAMP(6)",
              nullable: true,
              type: "string",
              is_pk: false,
            },
          },
          relations: {
            photo: {
              type: "many-to-one",
              from: {
                table: "comment_table",
                column: "photo_id",
              },
              to: {
                table: "photo",
                column: "photo_id",
              },
            },
            user_table: {
              type: "many-to-one",
              from: {
                table: "comment_table",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
          },
        },
        role_table: {
          name: "role_table",
          pk: ["role_id"],
          db_name: "ROLE_TABLE",
          fk: {
            user_id: {
              from: "user_id",
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
          },
          columns: {
            role_id: {
              name: "role_id",
              db_name: "ROLE_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: true,
            },
            user_id: {
              name: "user_id",
              db_name: "USER_ID",
              db_type: "NUMBER",
              nullable: false,
              type: "number",
              is_pk: false,
            },
            description: {
              name: "description",
              db_name: "DESCRIPTION",
              db_type: "VARCHAR2",
              nullable: false,
              type: "string",
              is_pk: false,
            },
            created_at: {
              name: "created_at",
              db_name: "CREATED_AT",
              db_type: "TIMESTAMP(6)",
              nullable: true,
              type: "string",
              is_pk: false,
            },
          },
          relations: {
            user_table: {
              type: "many-to-one",
              from: {
                table: "role_table",
                column: "user_id",
              },
              to: {
                table: "user_table",
                column: "user_id",
              },
            },
            user_table1: {
              type: "one-to-many",
              from: {
                table: "user_table",
                column: "role_id1",
              },
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
            user_table2: {
              type: "one-to-many",
              from: {
                table: "user_table",
                column: "role_id2",
              },
              to: {
                table: "role_table",
                column: "role_id",
              },
            },
          },
        },
      },
    } as QInspectResult,
    pq: {
      table: "user_table",
      select: [
        {
          col_name: "email",
          type: "column",
        },
      ],
    } as PQuerySelect,
    expand_rels: [] as {
      name: string;
      from_table: string;
      from_select?: PQuerySelect["select"];
      create_select: () => PQuerySelect["select"];
      rel?: PQuerySelectRel;
    }[],
  });

  return (
    <div className="flex overflow-auto">
      <div className="flex items-start">
        <div className="">
          <ColumnDetail
            inspect={local.inspect}
            table_name={local.pq.table}
            select={local.pq.select}
            onSelectChanged={(new_select) => {
              local.pq.select = new_select;
              local.render();
            }}
            onExpandRelation={(relation_name) => {
              if (local.expand_rels[0]?.name !== relation_name) {
                local.expand_rels = [];

                local.expand_rels.push({
                  name: relation_name,
                  from_table: local.pq.table,
                  from_select: local.pq.select,
                  create_select: () => {
                    return local.pq.select;
                  },
                  rel: local.pq.select?.find(
                    (item) =>
                      item.type === "relation" &&
                      item.rel_name === relation_name
                  ) as undefined | PQuerySelectRel,
                });
              } else {
                local.expand_rels = [];
              }

              local.render();
            }}
          />
        </div>
        {local.expand_rels.map((expand, index: number) => {
          const relation_name = expand.name;
          const relation_type =
            local.inspect.tables[expand.from_table]?.relations[expand.name]
              .type;

          let table_name = "" as TABLE_NAME;
          if (relation_type === "one-to-many") {
            table_name =
              local.inspect.tables[expand.from_table]?.relations[relation_name]
                ?.from.table;
          } else if (relation_type === "many-to-one") {
            table_name =
              local.inspect.tables[expand.from_table]?.relations[relation_name]
                ?.to.table;
          }

          return (
            <ColumnDetail
              key={index}
              inspect={local.inspect}
              select={expand.rel?.select || []}
              table_name={table_name}
              onSelectChanged={(new_select: PQuerySelect["select"]) => {
                if (!expand.rel) {
                  expand.rel = {
                    type: "relation",
                    rel_name: relation_name,
                    select: [],
                  };

                  if (!expand.from_select) {
                    expand.from_select = expand.create_select();
                  }

                  expand.from_select?.push(expand.rel);
                }
                expand.rel.select = new_select;

                // lenght === 0 delete expand.rel
                if (expand.rel.select.length === 0) {
                  const index_to_remove = expand.from_select?.indexOf(
                    expand.rel
                  );

                  if (index_to_remove !== undefined && index_to_remove > -1) {
                    expand.from_select?.splice(index_to_remove, 1);

                    expand.rel = undefined;
                  }
                }

                local.render();
              }}
              onExpandRelation={(relation_name) => {
                if (local.expand_rels[index + 1]?.name !== relation_name) {
                  local.expand_rels = local.expand_rels.slice(0, index + 1);

                  local.expand_rels.push({
                    name: relation_name,
                    from_table: table_name,
                    from_select: expand.rel?.select,
                    create_select: () => {
                      if (!expand.from_select) {
                        expand.from_select = expand.create_select();
                      }

                      if (!expand.rel) {
                        expand.rel = {
                          rel_name: expand.name,
                          type: "relation",
                          select: [],
                        };

                        expand.from_select.push(expand.rel);
                      }

                      return expand.rel.select!;
                    },
                    rel: expand.rel?.select!.find(
                      (item) =>
                        item.type === "relation" &&
                        item.rel_name === relation_name
                    ) as undefined | PQuerySelectRel,
                  });
                } else {
                  local.expand_rels = local.expand_rels.slice(0, index + 1);
                }

                local.render();
              }}
            />
          );
        })}
        <pre>{JSON.stringify(local.pq, null, 2)}</pre>
      </div>
    </div>
  );
};
