import { NodeModel } from "@minoru/react-dnd-treeview";
import { active } from "logic/active";
import { EDGlobal, PG } from "logic/ed-global";
import { PNode } from "logic/types";
import { PanelLeftClose } from "lucide-react";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { fuzzy } from "utils/ui/fuzzy";

export const EdTreeSearch = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    sref: null as HTMLInputElement | null,
    focus: false,
    hover: false,
    cursor: null as number | null,
    search_timeout: null as any,
  });

  p.ui.tree.search.ref = local.sref;

  useEffect(() => {
    const input = local.sref;
    if (input) input.setSelectionRange(local.cursor, local.cursor);
  }, [local.sref, local.cursor, p.ui.tree.search.value]);

  return (
    <div
      onMouseOver={() => {
        if (local.focus) {
          local.hover = true;
          local.render();
        }
      }}
      className="flex-1 flex items-stretch"
      onMouseLeave={() => {
        local.hover = false;
        local.render();
      }}
    >
      <form
        className="flex flex-1 items-stretch h-[24px] "
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          name="search-tree-prasi"
          ref={(ref) => {
            local.sref = ref;
          }}
          type="search"
          autoComplete="new-password"
          className={cx(
            "flex-1 outline-none border-2 px-1 text-[13px]",
            p.ui.tree.search.value
              ? "border-blue-600 bg-blue-50"
              : "border-transparent"
          )}
          placeholder="Search Name..."
          value={p.ui.tree.search.value || ""}
          spellCheck={false}
          onInput={(e) => {
            local.cursor = e.currentTarget.selectionStart;
            p.ui.tree.search.value = e.currentTarget.value;
            local.render();

            clearTimeout(local.search_timeout);
            local.search_timeout = setTimeout(() => {
              p.render();
            }, 100);
          }}
          onFocus={() => {
            local.focus = true;
            local.render();
          }}
          onBlur={() => {
            if (!local.hover && !p.ui.tree.search.value) {
              local.focus = false;
              local.render();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter") {
              const first = document.querySelector(
                ".tree-item:first-child"
              ) as HTMLInputElement;
              if (first) first.focus();
            }
          }}
        />
      </form>

      <div
        className="flex items-center px-1 cursor-pointer hover:text-blue-600"
        onClick={() => {
          if (!p.ui.panel.left) {
            p.ui.panel.left = true;
            localStorage.setItem("prasi-panel-left", "y");
          } else {
            p.ui.panel.left = false;
            localStorage.setItem("prasi-panel-left", "n");
          }
          p.render();
        }}
      >
        <PanelLeftClose size={15} />
      </div>
      {/* {(local.focus || local.hover || p.ui.tree.search.value) && (
        <div className="p-1 bg-white text-xs border-t flex space-x-1 justify-between">
          <div className="flex space-x-1">
            {Object.entries(p.ui.tree.search.mode).map(([name, active]) => {
              return (
                <div
                  className={cx(
                    "px-1 cursor-pointer rounded-sm border-blue-500 border",
                    active ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                  )}
                  onClick={() => {
                    (p.ui.tree.search.mode as any)[name] = !active;
                    local.render();
                    local.sref?.focus();
                  }}
                  key={name}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </div>
      )} */}
    </div>
  );
};

export const doTreeSearch = (p: PG) => {
  let tree: Record<string, { idx: number; node: NodeModel<PNode> }> = {};
  const search = p.ui.tree.search.value.toLowerCase();
  let i = 0;

  let ptree = p.page.tree.nodes.models;
  if (active.comp) {
    ptree = active.comp.nodes.models;
  }

  const comp_searched = new Set<string>();

  const searchInPTree = (ptree: NodeModel<PNode>[], id_component?: string) => {
    if (p.ui.tree.search.mode.Name) {
      const found = fuzzy(ptree, "data.item.name", search);

      const id_found = ptree.find((e) => e.id === search);
      let i = 0;

      if (id_found) {
        tree[id_found.id] = { idx: 0, node: { ...id_found, parent: "root" } };
        i = 1;
      }

      for (const row of found) {
        if (row.data) {
          tree[row.id] = { idx: i++, node: { ...row, parent: "root" } };
        }
      }
    }

    for (const row of ptree) {
      const item = row.data?.item;

      if (item) {
        // if (
        //   item.component?.id &&
        //   !comp_searched.has(item.component.id) &&
        //   p.comp.loaded[item.component.id]
        // ) {
        //   comp_searched.add(item.component.id);
        //   const tree = p.comp.loaded[item.component.id].tree;
        //   if (tree) {
        //     searchInPTree(tree, item.component.id);
        //   }
        // }

        const js = item.adv?.js;
        if (js) {
          if (p.ui.tree.search.mode.JS) {
            if ((js as string).toLowerCase().includes(search)) {
              if (id_component && row.data?.parent?.component)
                row.data.parent.component.comp_id = id_component;
              tree[item.id] = { idx: i++, node: { ...row, parent: "root" } };
            }
          }
        }
        const css = item.adv?.css;
        if (css) {
          if (p.ui.tree.search.mode.CSS) {
            if (css.toString().toLowerCase().includes(search)) {
              if (id_component && row.data?.parent?.component)
                row.data.parent.component.comp_id = id_component;
              tree[item.id] = { idx: i++, node: { ...row, parent: "root" } };
            }
          }
        }

        const html = item.adv?.html;
        if (html) {
          if (p.ui.tree.search.mode.HTML) {
            if (html.toString().toLowerCase().includes(search)) {
              if (id_component && row.data?.parent?.component)
                row.data.parent.component.comp_id = id_component;
              tree[item.id] = { idx: i++, node: { ...row, parent: "root" } };
            }
          }
        }
      }
    }
  };

  if (ptree) searchInPTree(ptree);

  return Object.values(tree)
    .sort((a, b) => a.idx - b.idx)
    .map((e) => e.node);
};
