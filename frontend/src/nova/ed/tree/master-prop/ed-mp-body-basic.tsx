import { getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { FC } from "react";
import { useGlobal } from "utils/react/use-global";
import { FNCompDef } from "utils/types/meta-fn";
import { FieldButtons, FieldDropdown, FieldString } from "./ed-mp-fields";
import { current } from "immer";

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

  const groups = [
    ...new Set(Object.keys(props).filter((n) => n.endsWith("__"))),
  ];

  return (
    <>
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
            getActiveTree(p).update(`Set Group to ${value}`, ({ tree }) => {
              if (tree.type === "item") {
                if (tree.component) {
                  if (value) {
                    const new_name = value + _name;

                    tree.component.props[new_name] =
                      tree.component.props[_name];
                    delete tree.component.props[_name];
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
            });
          }}
        />
      )}
      <FieldButtons
        label="Type"
        buttons={[
          {
            label: "TEXT",
            checked() {
              if (is_group) return false;
              if (prop.meta?.type !== "content-element")
                return prop.type === "string";

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
                    tree.component.props[_name].meta = {
                      type: "text",
                    };
                    tree.component.props[_name].type = "string";
                  }
                }
              });
            },
          },
          {
            label: "OPTIONS",
            checked() {
              if (is_group) return false;

              return prop.type === "option";
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

                    tree.component.props[_name].meta = {
                      type: "text",
                    };
                    tree.component.props[_name].type = "option";
                  }
                }
              });
            },
          },
          {
            label: "JSX",
            checked() {
              if (is_group) return false;

              return prop.meta?.type === "content-element";
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

                    tree.component.props[_name].meta = {
                      type: "content-element",
                    };
                    tree.component.props[_name].type = "string";
                  }
                }
              });
            },
          },
          !name.includes("__") || is_group
            ? {
                label: "GROUP",
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
      <div className="p-1 flex justify-start"></div>
      <pre className="whitespace-pre text-xs ">
        {JSON.stringify(prop, null, 2)}
      </pre>
    </>
  );
};
