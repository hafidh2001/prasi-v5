type TABLE_NAME = string;
type QUERY_NAME = string;
type COL_NAME = string;
type REL_NAME = string;
type WHERE_OPERATOR = string;

type PQuery = {
  name: QUERY_NAME;
  source: string;
  wizard: PQuerySelect | PQueryInsert;
};

export type PQuerySelect = {
  action: "select";
  table: TABLE_NAME;
  select: (PQuerySelectCol | PQuerySelectRel)[];
  where: PQuerySelectWhere[];
};

export type PQuerySelectCol = { col_name: COL_NAME; type: "column"; as?: string };
export type PQuerySelectRel = {
  rel_name: REL_NAME;
  type: "relation";
  as?: string;
} & Partial<Omit<PQuerySelect, "table" | "action">>;
type PQuerySelectWhere = {
  column: COL_NAME;
  operator: WHERE_OPERATOR;
  value?: any;
};

const a: PQuerySelect = {
  action: "select",
  table: "user",
  select: [
    {
      col_name: "username",
      type: "column",
    },
    {
      rel_name: "m_role",
      type: "relation",
      select: [
        {
          col_name: "role_name",
          type: "column",
        },
      ],
      where: [{ column: "name", operator: "=", value: "admin" }],
    },
  ],
  where: [
    {
      column: "status",
      operator: "=",
      value: "active",
    },
  ],
};

type PQueryInsert = {
  action: "select";
  table: TABLE_NAME;
};
