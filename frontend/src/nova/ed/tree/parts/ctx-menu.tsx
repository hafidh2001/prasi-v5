import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { PNode } from "logic/types";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNComponent } from "utils/types/meta-fn";
import { Menu, MenuItem } from "utils/ui/context-menu";
import { edActionDetach } from "../action/detach";
import { edActionNewComp } from "../action/new-comp";
import { edActionHide } from "../action/hide";
import { edActionRename } from "../action/rename";
import { edActionCut } from "../action/cut";
import { edActionDelete } from "../action/delete";
import { edActionClone } from "../action/clone";
import { edActionCopy } from "../action/copy";
import { edActionPaste } from "../action/paste";
import { edActionWrap, edActionWrapInComp } from "../action/wrap";
import { edActionUnwrap } from "../action/unwrap";
import { edActionAdd } from "../action/add";
import { Plus } from "lucide-react";

export const EdTreeCtxMenu = ({
  raw: raw,
  event,
  onClose,
}: {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  raw?: NodeModel<PNode>;
  onClose: () => void;
}) => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ allowCopy: false, allowPaste: false }, async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "clipboard-read",
      allowWithoutGesture: false,
    } as any);
    if (permissionStatus.state === "granted") {
      local.allowCopy = true;
      local.render();

      navigator.clipboard
        .readText()
        .then((e) => {
          if (e.startsWith("prasi-clipboard:")) {
            local.allowPaste = true;
            local.render();
          }
        })
        .catch(() => {});
    }
  });
  const item = raw?.data?.item as IItem;
  const type = item?.type;
  const comp = (item as IItem).component as FNComponent | undefined;
  let comp_id = comp?.id;

  const nodes = getActiveTree(p).nodes;
  if (!nodes.map[item.id]) {
    let parent = p.viref.item_parents[item.id];
    while (parent) {
      if (nodes.map[parent] && nodes.map[parent].item.component?.id) {
        comp_id = nodes.map[parent].item.component!.id;
        break;
      }

      parent = p.viref.item_parents[parent];
    }
  }

  const isActiveComponent = active.comp && active.comp?.id === comp_id;
  const isJSXProp = raw?.data?.parent?.component?.is_jsx_root;

  if (!item) {
    return (
      <Menu mouseEvent={event} onClose={onClose}>
        <MenuItem
          disabled
          label={<div className="text-slate-500">Unavailable</div>}
        />
      </Menu>
    );
  }

  return (
    <Menu mouseEvent={event} onClose={onClose}>
      {!comp_id && (
        <MenuItem
          hotKey={<Plus size={12} strokeWidth={2.5} />}
          label="Add Item"
          onClick={() => {
            active.item_id = item.id;
            edActionAdd(p);
          }}
        />
      )}
      {type === "text" && !comp_id && (
        <MenuItem
          label="Convert Text → Item"
          onClick={() => {
            getActiveTree(p).update("Convert Text → Item", ({ findNode }) => {
              const node = findNode(item.id);
              if (node) node.item.type = "item";
            });
            p.render();
          }}
        />
      )}

      {type === "item" &&
        !comp_id &&
        (!item.childs || (item.childs && item.childs.length === 0)) && (
          <MenuItem
            label={"Convert Item → Text" + comp_id}
            onClick={() => {
              getActiveTree(p).update("Convert Item → Text", ({ findNode }) => {
                const node = findNode(item.id);
                if (node) node.item.type = "text";
              });
              p.render();
            }}
          />
        )}
      {type === "item" && comp_id && !isActiveComponent && (
        <MenuItem
          label="Detach Component"
          onClick={() => edActionDetach(p, item)}
        />
      )}
      {type === "item" && !comp_id && !isJSXProp && (
        <MenuItem
          label="Create Component"
          onClick={(e) => edActionNewComp(p, item, e)}
        />
      )}
      <MenuItem
        label={item.hidden ? "Unhide" : "Hide"}
        onClick={() => edActionHide(p, item)}
      />
      {!isJSXProp && (
        <MenuItem
          label="Rename"
          hotKey={"↵"}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            edActionRename(p, item);
          }}
        />
      )}
      {!isJSXProp && (
        <MenuItem label="Cut" onClick={() => edActionCut(p, item)} />
      )}

      {!isActiveComponent && !isJSXProp && (
        <MenuItem
          label="Delete"
          hotKey="⌫"
          onClick={() => edActionDelete(p, item)}
        />
      )}

      {!isJSXProp && (
        <MenuItem label="Clone" onClick={() => edActionClone(p, item)} />
      )}

      {!isJSXProp && (
        <MenuItem label="Copy" onClick={() => edActionCopy(p, item)} />
      )}
      {local.allowCopy &&
        local.allowPaste &&
        (!comp_id || (comp_id && (item as IItem).component?.props.child)) && (
          <MenuItem label="Paste" onClick={() => edActionPaste(p, item)} />
        )}
      {["text", "item"].includes(item.type) && !isJSXProp && (
        <MenuItem
          label="Wrap in Item"
          onClick={() => edActionWrap(p, item as IItem)}
        />
      )}
      {["text", "item"].includes(item.type) && !isJSXProp && (
        <MenuItem
          label="Wrap in Component"
          onClick={() => edActionWrapInComp(p, item as IItem)}
        />
      )}

      {["item"].includes(item.type) && !isJSXProp && !comp_id && (
        <MenuItem
          label="Unwrap"
          onClick={() => edActionUnwrap(p, item as IItem)}
        />
      )}
    </Menu>
  );
};

const HotKey = (arg: { shortcut: string }) => {
  const ctrl =
    navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? (
      <div>⌘</div>
    ) : (
      <div className="text-[8px]">CTRL</div>
    );
  return (
    <div className="hot-key border border-slate-400 text-[10px] rounded-[3px] px-1 -mr-[2px] flex items-center space-x-1">
      {ctrl}
      <div>+</div> <div>{arg.shortcut}</div>
    </div>
  );
};
