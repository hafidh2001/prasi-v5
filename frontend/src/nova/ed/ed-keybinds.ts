import { useEffect } from "react";
import { PG } from "./logic/ed-global";
import keys from "ctrl-keys";
import { active } from "logic/active";
import { navNextItem, navPrevItem } from "./ed-topbar";

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

        if (active.comp) active.comp.undo();
        else p.page.tree.undo();
      }
    };
    const redo = async (e: any) => {
      if (!isWriteable() && p.page.tree) {
        e.preventDefault();
        e.stopPropagation();

        if (active.comp) active.comp.redo();
        else p.page.tree.redo();
      }
    };
    const save = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };

    handler.add("ctrl+s", save);
    handler.add("meta+s", save);
    handler.add("ctrl+z", undo);
    handler.add("meta+z", undo);
    handler.add("meta+shift+z", redo);
    handler.add("ctrl+y", redo);
    handler.add("ctrl+-", () => navPrevItem(p));
    handler.add("meta+-", () => navPrevItem(p));
    handler.add("ctrl+shift+-", () => navNextItem(p));
    handler.add("ctrl+=", () => navNextItem(p));
    handler.add("meta+=", () => navNextItem(p));
    window.addEventListener("keydown", handler.handle);

    return () => {
      window.removeEventListener("keydown", handler.handle);
    };
  }, []);
};
