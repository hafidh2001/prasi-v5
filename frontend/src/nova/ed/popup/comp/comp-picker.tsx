import {
  Tree as DNDTree,
  DndProvider,
  TreeMethods,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { EDGlobal } from "logic/ed-global";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Loading } from "utils/ui/loading";
import { Modal } from "utils/ui/modal";
import {
  CompPickerNode,
  compRenderPickerNode,
} from "./comp-picker/render-picker-node";
import { compPickerToNodes } from "./comp-picker/to-nodes";

const ID_PRASI_UI = "13143272-d4e3-4301-b790-2b3fd3e524e6";

export const EdPopCompPicker = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({
    tree_ref: null as TreeMethods | null,
    tab: "Components",
    checked: new Set<string>(),
    shift: false,
  });

  const popup = p.ui.popup.comp;
  popup.render = local.render;

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        local.shift = true;
        local.render();
      } else {
        if (local.shift) {
          local.shift = false;
          local.render();
        }
      }
    };

    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, []);

  useEffect(() => {
    if (!popup.on_pick) local.tab = "Components";
    else {
      (async () => {
        if (popup.data.groups.length === 0 || popup.data.comps.length === 0) {
          {
            popup.status = "loading";
            p.render();
            popup.data.groups = await _db.component_group.findMany({
              where: { component_site: { some: { id_site: p.site.id } } },
              select: {
                id: true,
                name: true,
              },
            });
            popup.data.comps = await _db.component.findMany({
              where: {
                id_component_group: { in: popup.data.groups.map((e) => e.id) },
              },
              select: {
                id: true,
                name: true,
                id_component_group: true,
              },
            });
            compPickerToNodes(p);
          }
          popup.status = "ready";
          p.render();
        }
      })();
    }
  }, [popup.on_pick]);

  useEffect(() => {
    local.tree_ref?.openAll();
  }, [popup.on_pick, local.tab]);

  if (!popup.on_pick) return null;

  let nodes =
    local.tab === "Components"
      ? popup.data.nodes.filter((e) => {
          if (e.data && e.data.type === "comp") {
            e.data.idx = e.parent.toString() + e.id.toString();
          }
          if (
            popup.search.value &&
            e.data?.type === "comp" &&
            !e.data.name
              .toLowerCase()
              .includes(popup.search.value.toLowerCase())
          ) {
            return false;
          }
          if (e.data?.type === "folder" && e.data.name === "__TRASH__")
            return false;
          return true;
        })
      : popup.data.nodes.filter((e) => {
          if (e.data && e.data.type === "comp") {
            e.data.idx = e.parent.toString() + e.id.toString();
          }
          if (e.data?.type === "folder" && e.data.name === "__TRASH__")
            return true;
          return false;
        });

  nodes = nodes.sort((a, b) =>
    (b.data?.idx || "").localeCompare(a.data?.idx || "")
  );

  // const has_prasi_ui = !!tree.find(
  //   (e) => e.data?.type === "folder" && e.data?.id === ID_PRASI_UI
  // );
  const TypedTree = DNDTree<CompPickerNode>;

  return (
    <>
      <Modal
        open
        onOpenChange={(open) => {
          if (!open) {
            popup.on_pick = null;
            p.render();
          }
        }}
        fade={false}
      >
        {/* {popup.import && <EdCompImport />} */}
        <div
          id="comp-picker"
          ref={(ref) => {
            if (ref) {
              popup.picker_ref = ref;
            }
          }}
          className={cx("absolute inset-[5%] bg-white flex")}
        >
          <div className="relative flex flex-1 items-stretch text-[14px] overflow-auto">
            {popup.status === "loading" && (
              <Loading note="listing-comp" backdrop={false} />
            )}
            {popup.status !== "loading" && (
              <>
                <div className="flex flex-1 flex-col">
                  <div className="flex h-[30px] border-b items-stretch mb-2 bg-slate-100">
                    <div className="flex items-end pl-1 space-x-1">
                      {["Components", "Trash"].map((e) => {
                        return (
                          <div
                            key={e}
                            className={cx(
                              "border cursor-pointer  -mb-[1px] px-2  hover:text-blue-500 hover:border-blue-500 hover:border-b-transparent select-none",
                              local.tab === e &&
                                "bg-white border-b-transparent",
                              local.tab !== e &&
                                "text-slate-400 border-b-slate-200 border-transparent bg-transparent"
                            )}
                            onClick={() => {
                              local.tab = e;
                              p.render();
                            }}
                          >
                            {e}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-1 mr-1 justify-end items-stretch">
                      {local.checked.size > 0 && (
                        <div
                          className="bg-white text-xs border border-red-600 flex items-center text-red-600 px-2 mr-1 hover:border-red-800 my-1 hover:bg-blue-50 cursor-pointer"
                          onClick={async () => {
                            if (confirm("Move selected components to trash?")) {
                              const data = p.ui.popup.comp.data;
                              const trash_folder = data.groups.find(
                                (e) => e.name === "__TRASH__"
                              );

                              if (trash_folder) {
                                await _db.component.updateMany({
                                  where: { id: { in: [...local.checked] } },
                                  data: { id_component_group: trash_folder.id },
                                });

                                data.comps.map((e) => {
                                  if (local.checked.has(e.id)) {
                                    const node = nodes.find(
                                      (item) => item.id === e.id
                                    );

                                    const found = data.comps.find(
                                      (item) => e.id === item.id
                                    );
                                    if (node && found) {
                                      found.id_component_group =
                                        trash_folder.id;
                                      node.parent = trash_folder.id;
                                    }
                                  }
                                });
                                p.render();
                              }
                            }
                          }}
                        >
                          <Trash size={11} className="mr-1" />
                          <div>
                            Delete {local.checked.size}{" "}
                            {local.checked.size > 1
                              ? "components"
                              : "component"}
                          </div>
                        </div>
                      )}
                      <div
                        className="bg-white text-xs border px-2 mr-1 my-1 flex items-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        onClick={async () => {
                          const name = prompt("Folder Name:");
                          if (name) {
                            await _db.component_group.create({
                              data: {
                                name,
                                component_site: {
                                  create: {
                                    id_site: p.site.id,
                                    is_owner: true,
                                  },
                                },
                              },
                            });
                            // await reloadCompPicker(p);
                          }
                        }}
                      >
                        + Folder
                      </div>
                      {/* <div
                        className="bg-white text-xs border px-2 mr-1 my-1 flex items-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        onClick={async () => {
                          if (
                            has_prasi_ui &&
                            confirm("Remove Prasi UI? You can add it later")
                          ) {
                            await _db.component_site.deleteMany({
                              where: {
                                id_site: p.site.id,
                                id_component_group: ID_PRASI_UI,
                              },
                            });
                          } else if (confirm("Add Prasi UI?")) {
                            await _db.component_site.create({
                              data: {
                                id_site: p.site.id,
                                id_component_group: ID_PRASI_UI,
                              },
                            });
                          }

                          await reloadCompPicker(p);
                          p.render();
                        }}
                      >
                        {!has_prasi_ui && (
                          <span className="mr-[2px] text-green-700">Add</span>
                        )}
                        {has_prasi_ui && (
                          <span className="mr-[2px] text-red-500">Remove</span>
                        )}
                        <span>Prasi</span>
                        <span className="font-bold text-slate-600 text-xs">
                          UI
                        </span>
                      </div> */}

                      <div
                        className="bg-white text-xs border px-2 mr-1 my-1 flex items-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        onClick={async () => {
                          // reloadCompPicker(p);
                          p.render();
                        }}
                        dangerouslySetInnerHTML={{
                          __html: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
                        }}
                      ></div>
                      {/* <div
                        className="bg-white text-xs border px-2 mr-1 my-1 flex items-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        onClick={() => {
                          popup.should_import = true;
                          p.render();
                        }}
                      >
                        Import Components
                      </div> */}
                      <input
                        type="search"
                        placeholder="Search"
                        spellCheck={false}
                        className="my-1 bg-transparent bg-white border outline-none px-1 focus:border-blue-500 focus:w-[300px] transition-all"
                        autoFocus
                        value={popup.search.value}
                        onChange={(e) => {
                          popup.search.value = e.currentTarget.value;
                          p.render();
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-auto flex">
                    <div
                      className={cx(
                        "absolute inset-0",
                        css`
                          > .tree-container {
                            max-width: 100%;
                            height: 100%;
                          }

                          > .tree-root > .listitem:first-child > div {
                            border-top: 0;
                          }

                          .dropping {
                            background: #efefff;
                          }
                        `,
                        css`
                          > .tree-root > .listitem > .tree-container {
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            position: relative;
                          }
                        `
                      )}
                    >
                      {popup.picker_ref && popup.status === "ready" && (
                        <DndProvider
                          backend={HTML5Backend}
                          options={getBackendOptions({
                            html5: {
                              rootElement: popup.picker_ref,
                            },
                          })}
                        >
                          <TypedTree
                            ref={(ref) => {
                              if (local.tree_ref !== ref) {
                                local.tree_ref = ref;
                              }
                            }}
                            tree={nodes}
                            initialOpen={true}
                            rootId={"root"}
                            sort={false}
                            onDrop={async (newTree, opt) => {
                              // compPicker.tree = newTree;
                              // p.render();
                              // if (
                              //   typeof opt.dragSourceId === "string" &&
                              //   typeof opt.dropTargetId === "string"
                              // ) {
                              //   _db.component.update({
                              //     where: {
                              //       id: opt.dragSourceId,
                              //     },
                              //     data: {
                              //       id_component_group: opt.dropTargetId,
                              //     },
                              //   });
                              // }
                            }}
                            dragPreviewRender={() => <></>}
                            canDrag={() => true}
                            canDrop={(tree, opt) => {
                              if (opt.dropTarget?.data?.type === "comp")
                                return false;
                              if (opt.dropTargetId === "comp-root")
                                return false;
                              return true;
                            }}
                            classes={{
                              root: "tree-root flex-1",
                              listItem: "listitem",
                              container: "tree-container",
                              dropTarget: "dropping",
                            }}
                            render={(node, prm) =>
                              compRenderPickerNode(
                                node,
                                prm,
                                local.checked.has(node.id as string),
                                (item_id) => {
                                  if (local.shift) {
                                    const first_idx = nodes.findIndex((e) =>
                                      local.checked.has(e.id as string)
                                    );

                                    const second_idx = nodes.findIndex(
                                      (e) => e.id === item_id
                                    );

                                    for (
                                      let i = Math.min(first_idx, second_idx);
                                      i <= Math.max(first_idx, second_idx);
                                      i++
                                    ) {
                                      const node = nodes[i];
                                      if (node.data?.type === "comp") {
                                        local.checked.add(node.id as string);
                                      }
                                    }

                                    return;
                                  }
                                  if (local.checked.has(item_id)) {
                                    local.checked.delete(item_id);
                                  } else {
                                    local.checked.add(item_id);
                                  }
                                }
                              )
                            }
                          />
                        </DndProvider>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
