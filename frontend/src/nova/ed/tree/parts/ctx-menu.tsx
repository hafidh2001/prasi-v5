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
export const EdTreeCtxMenu = ({
  raw: raw,
  event,
  onClose,
}: {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  raw: NodeModel<PNode>;
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
  const item = raw.data?.item as IItem;
  const type = item?.type;
  const comp = (item as IItem).component as FNComponent | undefined;
  const isComponent = comp?.id;
  const isActiveComponent = active.comp && active.comp?.id === comp?.id;
  const isJSXProp = raw.data?.parent?.component?.is_jsx_root;
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
      {!comp?.id && (
        <MenuItem label="Add Item" onClick={() => edActionAdd(p, item)} />
      )}
      {type === "text" && (
        <MenuItem
          label="Convert Text → Item"
          onClick={() => {
            getActiveTree(p).update(({ findNode }) => {
              const node = findNode(item.id);
              if (node) node.item.type = "item";
            });
            p.render();
          }}
        />
      )}

      {type === "item" &&
        (!item.childs || (item.childs && item.childs.length === 0)) && (
          <MenuItem
            label="Convert Item → Text"
            onClick={() => {
              getActiveTree(p).update(({ findNode }) => {
                const node = findNode(item.id);
                if (node) node.item.type = "text";
              });
              p.render();
            }}
          />
        )}
      {type === "item" && comp?.id && !isActiveComponent && (
        <MenuItem
          label="Detach Component"
          onClick={() => edActionDetach(p, item)}
        />
      )}
      {type === "item" && !comp?.id && !isJSXProp && (
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
          onClick={() => edActionRename(p, item)}
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
        (!isComponent ||
          (isComponent && (item as IItem).component?.props.child)) && (
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

      {["item"].includes(item.type) && !isJSXProp && !isComponent && (
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
