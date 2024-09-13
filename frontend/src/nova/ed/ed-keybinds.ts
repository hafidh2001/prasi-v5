import { useEffect } from "react";
import { PG } from "./logic/ed-global";
import keys from "ctrl-keys";

export const prasiKeybinding = (p: PG) => {
  useEffect(() => {
    const handler = keys();

    const isWriteable = () => {
      const active = document.activeElement;
      if (active) {
        if (
          active.hasAttribute("content-editable") ||
          ["INPUT", "TEXTAREA"].includes(active.tagName)
        ) {
          return true;
        }
      }
    };

    const undo = async (e: any) => {
      if (!isWriteable() && p.page.tree) {
        e.preventDefault();
        e.stopPropagation();
        p.page.tree.undo();
      }
    };
    const redo = async (e: any) => {
      if (!isWriteable() && p.page.tree) {
        e.preventDefault();
        e.stopPropagation();
        p.page.tree.redo();
      }
    };
    handler.add("ctrl+z", undo);
    handler.add("meta+z", undo);
    handler.add("meta+shift+z", redo);
    handler.add("ctrl+y", redo);
    window.addEventListener("keydown", handler.handle);

    return () => {
      window.removeEventListener("keydown", handler.handle);
    };
  }, []);
};
