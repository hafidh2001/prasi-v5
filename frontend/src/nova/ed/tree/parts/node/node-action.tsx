import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { loadCompTree } from "crdt/load-comp-tree";
import { getNodeById, updateNodeById } from "crdt/node/get-node-by-id";
import { AudioWaveform } from "lucide-react";
import { iconExpr } from "popup/expr/parts/expr-icon";
import { waitUntil } from "prasi-utils";
import { useGlobal } from "../../../../../utils/react/use-global";
import { Tooltip } from "../../../../../utils/ui/tooltip";
import { active } from "../../../logic/active";
import { EDGlobal } from "../../../logic/ed-global";
import { PNode } from "../../../logic/types";
export const EdTreeAction = ({
  raw,
}: {
  raw: NodeModel<PNode>;
  render_params: RenderParams;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const item = raw.data?.item;
  if (!item) return null;
  const comp = {
    editable: item.type !== "text" && !!item.component?.id,
    id: item.type !== "text" && item.component ? item.component.id : "",
  };

  let mode = "";
  let has_js = false;
  let has_css = false;
  if (item.adv?.js) {
    if (!mode) mode = "js";
    has_js = true;
  }
  if (item.adv?.css) {
    if (!mode) mode = "css";
    has_css = true;
  }
  if (!mode && item.adv?.html) mode = "html";

  let child_jsx_has_script = false;
  const child_id = item.component?.props?.child?.content?.id;
  if (child_id && active.comp?.id !== item.component?.id) {
    const meta = getNodeById(p, child_id);
    const item = meta?.item;
    child_jsx_has_script = true;
    if (item) {
      mode = "";
      if (item.adv?.js) mode = "js";
      if (!mode && item.adv?.css) mode = "css";
      if (!mode && item.adv?.html) mode = "html";
    }
  }

  const has_content = !!item.content;
  const has_loop = !!item.loop;
  const has_event = has_content || has_loop;
  return (
    <div className="flex items-center pr-1 space-x-1">
      {has_event && (
        <Tooltip
          content={
            <div className="flex space-x-1 items-center">
              {iconExpr} <div>Expression defined, JS disabled</div>
            </div>
          }
        >
          <AudioWaveform
            size={16}
            className="mr-1 text-blue-500 bg-white p-[2px] rounded-[3px]"
          />
        </Tooltip>
      )}
      {!!item.hidden && (
        <Tooltip content="Hidden: All">
          <div
            className="mx-1 cursor-pointer hover:opacity-60"
            onClick={(e) => {
              e.stopPropagation();

              updateNodeById(p, item.id, "Hide item", ({ node }) => {
                node.item.hidden = false;
              });
            }}
          >
            <HideEditor />
          </div>
        </Tooltip>
      )}

      {(!comp.editable ||
        (comp.editable && comp.id === active.comp?.id) ||
        child_jsx_has_script) && (
        <>
          {has_js && (
            <div className="node-text text-[9px] text-orange-500 ml-1">JS</div>
          )}
          {has_css && (
            <div className="node-text text-[9px] text-green-800 ml-1">CSS</div>
          )}
          {/* <div
            className={cx(
              "node-action border rounded-sm text-[9px] flex w-[20px] h-[15px] items-center cursor-pointer justify-center uppercase",
              !no_adv
                ? `opacity-100`
                : cx(
                    `opacity-0 action-script transition-all`,
                    css`
                      &:hover {
                        opacity: 1 !important;
                      }
                    `
                  ),

              !has_event &&
                cx(
                  no_adv &&
                    `bg-orange-100  border-orange-200 hover:border-orange-500 hover:text-orange-900 hover:bg-orange-300`,
                  mode === "js" &&
                    `bg-orange-100 border-orange-200 hover:border-orange-500 hover:text-orange-900 hover:bg-orange-300`,
                  mode === "css" &&
                    `bg-green-100  border-green-200 hover:border-green-500 hover:text-green-900 hover:bg-green-300`,
                  mode === "html" &&
                    `bg-blue-400 text-white border-blue-400 hover:border-blue-500 hover:bg-blue-300`
                ),
              has_event &&
                cx(
                  no_adv &&
                    `bg-orange-100 border-green-200 hover:border-green-500 hover:text-green-900 hover:bg-green-300`,
                  mode === "css" &&
                    `bg-green-100  border-green-200 hover:border-green-500 hover:text-green-900 hover:bg-green-300`
                )
            )}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (active.item_id === item.id && p.ui.popup.script.open) {
                closeEditor(p);
              } else {
                p.ui.tree.tooltip.open = "";
                if (has_content) mode = "css";

                if (
                  item.component?.props?.child?.content?.id &&
                  child_jsx_has_script
                ) {
                  e.stopPropagation();
                  e.preventDefault();

                  active.item_id = item.component.props.child.content.id;
                  p.ui.popup.script.open = true;
                  p.ui.popup.script.type = "item";
                  p.ui.popup.script.mode = (mode || "js") as any;
                  p.render();

                  return;
                }

                p.ui.popup.script.open = true;
                p.ui.popup.script.type = "item";
                p.ui.popup.script.mode = (mode || "js") as any;
                p.render();
              }
            }}
          >
            <Scroll size={9} />
          </div> */}
        </>
      )}
      {comp.editable && (
        <>
          {comp.id !== active.comp?.id && p.ui.comp.editable && (
            <Tooltip content="Edit Component">
              <div
                className="node-action flex items-center border ml-1 border-slate-500 bg-white rounded-sm text-[10px] px-[2px] cursor-pointer hover:bg-purple-100 hover:border-purple-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  const comp_id = comp.id;
                  if (comp_id && p.sync) {
                    p.ui.comp.loading_id = item.id;
                    p.render();
                    active.instance.item_id = item.id;

                    if (active.comp) {
                      p.ui.comp.last_edit_ids.push(active.comp.id);
                      active.comp.destroy();
                    }

                    active.comp = await loadCompTree({
                      id: comp.id,
                      p,
                      async on_update(ctree) {
                        const id = comp.id;
                        if (!p.comp.loaded[id]) {
                          await waitUntil(() => p.comp.loaded[id]);
                        }

                        if (p.viref.resetCompInstance)
                          p.viref.resetCompInstance(id);
                        p.comp.loaded[id].content_tree = ctree;
                        p.render();
                        p.ui.editor.render();
                      },
                    });
                    p.ui.comp.loading_id = "";
                    p.render();
                  }
                }}
              >
                Edit
              </div>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

const HideEditor = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.7649 6.07596C14.9991 6.22231 15.0703 6.53079 14.9239 6.76495C14.4849 7.46743 13.9632 8.10645 13.3702 8.66305L14.5712 9.86406C14.7664 10.0593 14.7664 10.3759 14.5712 10.5712C14.3759 10.7664 14.0593 10.7664 13.8641 10.5712L12.6011 9.30817C11.805 9.90283 10.9089 10.3621 9.93375 10.651L10.383 12.3277C10.4544 12.5944 10.2961 12.8685 10.0294 12.94C9.76267 13.0115 9.4885 12.8532 9.41704 12.5865L8.95917 10.8775C8.48743 10.958 8.00036 10.9999 7.50001 10.9999C6.99965 10.9999 6.51257 10.958 6.04082 10.8775L5.58299 12.5864C5.51153 12.8532 5.23737 13.0115 4.97064 12.94C4.7039 12.8686 4.5456 12.5944 4.61706 12.3277L5.06625 10.651C4.09111 10.3621 3.19503 9.90282 2.3989 9.30815L1.1359 10.5712C0.940638 10.7664 0.624058 10.7664 0.428798 10.5712C0.233537 10.3759 0.233537 10.0593 0.428798 9.86405L1.62982 8.66303C1.03682 8.10643 0.515113 7.46742 0.0760677 6.76495C-0.0702867 6.53079 0.000898544 6.22231 0.235065 6.07596C0.469231 5.9296 0.777703 6.00079 0.924058 6.23496C1.40354 7.00213 1.989 7.68057 2.66233 8.2427C2.67315 8.25096 2.6837 8.25972 2.69397 8.26898C4.00897 9.35527 5.65537 9.99991 7.50001 9.99991C10.3078 9.99991 12.6564 8.5063 14.076 6.23495C14.2223 6.00079 14.5308 5.9296 14.7649 6.07596Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const HideAll = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);
