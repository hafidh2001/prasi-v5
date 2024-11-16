import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { jscript } from "utils/script/jscript";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import {
  FieldButtons,
  FieldCode,
  FieldDropdown,
  FieldString,
} from "./ed-mp-fields";

export const EdMasterPropBodyBasic: FC<{
  name: string;
  prop: FNCompDef;
  props: Record<string, FNCompDef>;
}> = ({ name, prop, props }) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const is_group = name.endsWith("__");
  let _name = is_group ? name.slice(0, -2) : name;
  const group_part = name.split("__");
  let group = "";
  if (group_part.length > 1 && !is_group) {
    group = group_part[0] + "__";
    _name = group_part[1];
  }
  const meta = propMeta(prop);

  const groups = [
    ...new Set(Object.keys(props).filter((n) => n.endsWith("__"))),
  ];

  return (
    <div
      className={cx(
        "flex items-stretch flex-col",
        css`
          .mp-field {
            &:hover {
              .mp-label {
                background: #3c56d8;
                color: white;
              }
            }
          }
          .mp-label {
            width: 55px;
          }
        `
      )}
    >
      <FieldString
        label="Name"
        value={_name}
        onBeforeChange={(value) => {
          return value.replace(/[^a-zA-Z0-9_]/g, "_");
        }}
        onBlur={(value) => {
          if (!value || value === _name) return;
          getActiveTree(p).update(`Rename ${_name} to ${value}`, ({ tree }) => {
            if (tree.type === "item") {
              if (tree.component) {
                let new_name = value;
                if (is_group) {
                  new_name = value + "__";
                } else {
                  if (name.includes("__")) {
                    const group_name = name.split("__").shift();
                    new_name = group_name + "__" + value;
                  }
                }
                tree.component.props[new_name] = tree.component.props[name];
                delete tree.component.props[name];
                p.ui.tree.comp.active = new_name;
              }
            }
          });
        }}
      />
      <FieldString
        label="Label"
        value={prop.label || ""}
        onChange={(value) => {
          getActiveTree(p).update(`Set Label to ${value}`, ({ tree }) => {
            if (tree.type === "item") {
              if (tree.component) {
                tree.component.props[name].label = value;
              }
            }
          });
        }}
      />
      {!is_group && (
        <FieldDropdown
          label="Group"
          value={group}
          list={[
            { label: "- None -", value: "" },
            ...groups.map((e) => ({
              label: props?.[e].label || e.substring(0, -2),
              value: e,
            })),
          ]}
          onChange={(value) => {
            getActiveTree(p).update(
              `Set Group to ${value.substring(0, -2)}`,
              ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    if (value) {
                      const old_group = name.split("__").shift();
                      const old_name = old_group ? name : _name;
                      const new_name = value + _name;

                      tree.component.props[new_name] =
                        tree.component.props[old_name];
                      delete tree.component.props[old_name];
                      p.ui.tree.comp.active = new_name;
                    } else {
                      const new_name = name.split("__").pop() || name;

                      if (new_name !== name) {
                        tree.component.props[new_name] =
                          tree.component.props[name];
                        delete tree.component.props[name];
                        p.ui.tree.comp.active = new_name;
                      }
                    }
                  }
                }
              }
            );
          }}
        />
      )}
      <FieldButtons
        label="Type"
        buttons={[
          {
            label: "Text",
            checked() {
              if (is_group) return false;
              const meta = propMeta(prop);
              if (meta.type !== "content-element") return meta.type === "text";

              return false;
            },
            check() {
              getActiveTree(p).update(`Set Type to TEXT`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    if (is_group) {
                      _name = name.slice(0, -2);
                      tree.component.props[_name] =
                        tree.component.props[_name + "__"];
                      delete tree.component.props[_name + "__"];
                      p.ui.tree.comp.active = _name;
                    } else if (name.includes("__")) {
                      _name = name;
                    }
                    let meta = prepMeta(tree, name);
                    if (meta) meta.type = "text";
                  }
                }
              });
            },
          },
          {
            label: "Options",
            checked() {
              if (is_group) return false;

              const meta = propMeta(prop);
              if (meta.type !== "content-element")
                return meta.type === "option";
              return false;
            },
            check() {
              getActiveTree(p).update(`Set Type to OPTIONS`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    if (is_group) {
                      _name = name.slice(0, -2);
                      tree.component.props[_name] =
                        tree.component.props[_name + "__"];
                      delete tree.component.props[_name + "__"];
                      p.ui.tree.comp.active = _name;
                    } else if (name.includes("__")) {
                      _name = name;
                    }

                    let meta = prepMeta(tree, name);
                    if (meta) meta.type = "option";
                  }
                }
              });
            },
          },
          {
            label: "List",
            checked() {
              if (is_group) return false;
              const meta = propMeta(prop);
              if (meta.type !== "content-element") return meta.type === "list";

              return false;
            },
            check() {
              getActiveTree(p).update(`Set Type to List`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    if (is_group) {
                      _name = name.slice(0, -2);
                      tree.component.props[_name] =
                        tree.component.props[_name + "__"];
                      delete tree.component.props[_name + "__"];
                      p.ui.tree.comp.active = _name;
                    } else if (name.includes("__")) {
                      _name = name;
                    }
                    let meta = prepMeta(tree, name);
                    if (meta) meta.type = "list";
                  }
                }
              });
            },
          },
          {
            label: "JSX",
            checked() {
              if (is_group) return false;

              const meta = propMeta(prop);
              return meta.type === "content-element";
            },
            check() {
              getActiveTree(p).update(`Set Type to JSX`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    if (is_group) {
                      _name = name.slice(0, -2);
                      tree.component.props[_name] =
                        tree.component.props[_name + "__"];
                      delete tree.component.props[_name + "__"];
                      p.ui.tree.comp.active = _name;
                    } else if (name.includes("__")) {
                      _name = name;
                    }

                    const meta = prepMeta(tree, name);
                    if (meta) meta.type = "content-element";
                  }
                }
              });
            },
          },
          !name.includes("__") || is_group
            ? {
                label: "Group",
                checked() {
                  if (is_group) return true;
                  return false;
                },
                check() {
                  getActiveTree(p).update(`Set Type to Group`, ({ tree }) => {
                    if (tree.type === "item") {
                      if (tree.component) {
                        tree.component.props[_name + "__"] =
                          tree.component.props[_name];

                        delete tree.component.props[_name];
                        p.ui.tree.comp.active = _name + "__";
                      }
                    }
                  });
                },
              }
            : undefined,
        ]}
      />
      {meta.type === "option" && (
        <FieldButtons
          label="Mode"
          buttons={[
            {
              label: "Button",
              checked: () => {
                return (
                  prop.meta?.option_mode === "button" || !prop.meta?.option_mode
                );
              },
              check: () => {
                getActiveTree(p).update(
                  `Prop ${name} Set Button`,
                  ({ tree }) => {
                    if (tree.type === "item") {
                      let meta = prepMeta(tree, name);
                      if (meta) {
                        meta.option_mode = "button";
                      }
                    }
                  }
                );
              },
            },
            {
              label: "Dropdown",
              checked: () => {
                return prop.meta?.option_mode === "dropdown";
              },
              check: () => {
                getActiveTree(p).update(
                  `Prop ${name} Set Dropdown`,
                  ({ tree }) => {
                    if (tree.type === "item") {
                      let meta = prepMeta(tree, name);
                      if (meta) {
                        meta.option_mode = "dropdown";
                      }
                    }
                  }
                );
              },
            },
            {
              label: "Checkbox",
              checked: () => {
                return prop.meta?.option_mode === "checkbox";
              },
              check: () => {
                getActiveTree(p).update(
                  `Prop ${name} Set Checkbox`,
                  ({ tree }) => {
                    if (tree.type === "item") {
                      let meta = prepMeta(tree, name);
                      if (meta) {
                        meta.option_mode = "checkbox";
                      }
                    }
                  }
                );
              },
            },
          ]}
        />
      )}

      {(meta.type === "option" || meta.type === "list") && (
        <FieldCode
          label={meta.type === "option" ? "Option" : "List"}
          default={
            meta.type === "option"
              ? `\
[
  {
    label: "yes",
    value: "y",
  },
  {
    label: "no",
    value: "n",
  },
] as Options`
              : `\
[
  {
    type: "string",
  }
] as List`
          }
          typings={
            meta.type === "list"
              ? `\
type List = { type: "string" }[] `
              : `\
type Options = ({ type: string, value: any} | string)[]
              `
          }
          value={prop.meta?.options}
          onChange={async (val) => {
            const source_built = (
              await jscript.transform?.(val.trim(), {
                jsx: "transform",
                format: "cjs",
                logLevel: "silent",
                loader: "tsx",
              })
            )?.code;

            getActiveTree(p).update(`Prop ${name} Set Options`, ({ tree }) => {
              if (tree.type === "item") {
                let meta = prepMeta(tree, name);
                if (meta) {
                  meta.options = val;
                  meta.optionsBuilt = source_built;
                }
              }
            });
          }}
        />
      )}

      {!is_group && (
        <FieldCode
          label="Default"
          default="''"
          value={prop.value}
          onChange={async (val) => {
            const source_built = (
              await jscript.transform?.(val.trim(), {
                jsx: "transform",
                format: "cjs",
                logLevel: "silent",
                loader: "tsx",
              })
            )?.code;

            getActiveTree(p).update(`Prop ${name} Set Options`, ({ tree }) => {
              if (tree.type === "item" && tree.component) {
                tree.component.props[name].value = val;
                tree.component.props[name].valueBuilt = source_built;
              }
            });
          }}
        />
      )}

      <FieldCode
        label="Visible"
        default="true"
        value={prop.visible}
        onChange={async (val) => {
          getActiveTree(p).update(`Prop ${name} Set Visible`, ({ tree }) => {
            if (tree.type === "item" && tree.component) {
              tree.component.props[name].visible = val;
            }
          });
        }}
      />
      <div className="p-1 flex justify-start"></div>
      {/* <pre className="whitespace-pre text-xs ">
        {JSON.stringify(prop, null, 2)}
      </pre> */}
    </div>
  );
};

const prepMeta = (tree: IItem, name: string) => {
  if (tree.component) {
    let meta = tree.component.props[name].meta;
    if (!tree.component.props[name].meta) {
      tree.component.props[name].meta = {
        type: "text",
      };
      meta = tree.component.props[name].meta;
    }
    return meta;
  }
};

const propMeta = (prop: FNCompDef) => {
  if (!prop.meta) {
    return {
      type: "text",
    };
  }
  return prop.meta;
};
