import { getActiveTree } from "logic/active";
import { Trash } from "lucide-react";
import { FC } from "react";
import { FNCompDef } from "utils/types/meta-fn";
import { FieldButtons, FieldString } from "./ed-mp-fields";
import { useGlobal } from "utils/react/use-global";
import { EDGlobal } from "logic/ed-global";

export const EdMasterPropBodyBasic: FC<{ name: string; prop: FNCompDef }> = ({
  name,
  prop,
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");

  return (
    <>
      <FieldString
        label="Name"
        value={name}
        onBeforeChange={(value) => {
          return value.replace(/[^a-zA-Z0-9_]/g, "_");
        }}
        onBlur={(value) => {
          if (!value || value === name) return;
          getActiveTree(p).update(`Rename ${name} to ${value}`, ({ tree }) => {
            if (tree.type === "item") {
              if (tree.component) {
                tree.component.props[value] = tree.component.props[name];
                delete tree.component.props[name];
                p.ui.tree.comp.active = value;
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
      <FieldButtons
        label="Type"
        buttons={[
          {
            label: "TEXT",
            checked() {
              if (prop.meta?.type !== "content-element")
                return prop.type === "string";

              return false;
            },
            check() {
              getActiveTree(p).update(`Set Type to TEXT`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    tree.component.props[name].meta = {
                      type: "text",
                    };
                    tree.component.props[name].type = "string";
                  }
                }
              });
            },
          },
          {
            label: "OPTIONS",
            checked() {
              return prop.type === "option";
            },
            check() {
              getActiveTree(p).update(`Set Type to TEXT`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    tree.component.props[name].meta = {
                      type: "text",
                    };
                    tree.component.props[name].type = "option";
                  }
                }
              });
            },
          },
          {
            label: "JSX",
            checked() {
              return prop.meta?.type === "content-element";
            },
            check() {
              getActiveTree(p).update(`Set Type to JSX`, ({ tree }) => {
                if (tree.type === "item") {
                  if (tree.component) {
                    tree.component.props[name].meta = {
                      type: "content-element",
                    };
                    tree.component.props[name].type = "string";
                  }
                }
              });
            },
          },
        ]}
        onChange={() => {}}
      />
      <div className="p-1 flex justify-start"></div>
      <pre className="whitespace-pre text-xs ">
        {JSON.stringify(prop, null, 2)}
      </pre>
    </>
  );
};
