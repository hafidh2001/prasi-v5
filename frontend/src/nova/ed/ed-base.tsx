import { loadPageTree, PageTree } from "crdt/load-page-tree";
import {
  loadPendingComponent
} from "crdt/node/load-child-comp";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGlobal } from "../../utils/react/use-global";
import { w } from "../../utils/types/general";
import { isLocalhost } from "../../utils/ui/is-localhost";
import { Loading } from "../../utils/ui/loading";
import { prasiKeybinding } from "./ed-keybinds";
import { EdLeft } from "./ed-left";
import { EDGlobal } from "./logic/ed-global";
import { iconVSCode } from "./ui/icons";

export const EdBase = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  prasiKeybinding(p);

  if (!p.page.tree && p.page.cur && p.sync) {
    p.page.tree = loadPageTree(p.sync, p.page.cur.id, {
      async loaded() {
        await loadPendingComponent(p);
        p.render();
      },
      async on_component(item) {
        if (p.sync && item.component) {
          const comp_id = item.component.id;
          if (!p.comp.loaded[comp_id] && !p.comp.pending.has(comp_id)) {
            p.comp.pending.add(comp_id);
          }
        }
      },
    });
  }

  if (p.status === "load-site" && p.site) {
    return (
      <Loading
        note={
          <div className="flex flex-col items-center space-y-1 relative">
            <div>{p.site.name || p.site.id}</div>
            <div className="pb-2">{`page-${p.status}`}</div>
            {p.site.id && (
              <div className="absolute top-[50px]">
                <a
                  href={`${vscode_url}folder=/site/${p.site.id}/site/src`}
                  target="_blank"
                  className={cx(
                    "flex space-x-1 border items-center rounded-md px-2 cursor-pointer pointer-events-auto",
                    css`
                      svg {
                        width: 11px;
                      }
                    `
                  )}
                >
                  <div dangerouslySetInnerHTML={{ __html: iconVSCode }} />
                  <div>Open VSCode</div>
                </a>
              </div>
            )}
          </div>
        }
      />
    );
  }
  if (p.status === "site-not-found" || p.status === "page-not-found") {
    return (
      <div className="flex fixed inset-0 items-center justify-center">
        {p.status === "site-not-found" ? "Site not found" : "Page not found"}
      </div>
    );
  }

  return (
    <div
      className={cx("flex flex-col flex-1", style)}
      onPointerLeave={() => {
        w.pointer_active = false;
      }}
      onPointerEnter={() => {
        w.pointer_active = true;
      }}
    >
      <PanelGroup autoSaveId="prasi-editor" direction="horizontal">
        <Panel defaultSize={18} className="flex" minSize={15}>
          <EdLeft />
        </Panel>
        <PanelResizeHandle />
        <Panel>{p.page.tree && <Preview tree={p.page.tree} />}</Panel>
        <PanelResizeHandle />
        <Panel defaultSize={25}></Panel>
      </PanelGroup>
    </div>
  );
};

const Preview = ({ tree }: { tree: PageTree }) => {
  const root = tree.watch((e) => e);
  return (
    <div
      className="relative overflow-auto w-full h-full border-r"
      onClick={async () => {
        tree.update((e) => {
          e.tree.id = "MO" + Date.now();
        });
      }}
    >
      <pre className="text-[8px] absolute inset-0">
        {Date.now()}
        {JSON.stringify(
          root,
          // Object.entries(root as any)
          //   .map(([k, v]) => {
          //     if (typeof v !== "object") return [k, v];
          //   })
          //   .filter((e) => e),
          null,
          2
        )}
      </pre>
    </div>
  );
};

const vscode_url = isLocalhost()
  ? "http://localhost:8443?"
  : "https://prasi-vsc.avolut.com/?tkn=prasi&";

const style = css`
  .toolbar-box {
    display: flex;
    align-items: stretch;
    border-left: 1px solid #ececeb;
    border-right: 1px solid #ececeb;
    margin: 0px 0px 0px 5px;

    .label {
      display: flex;
      user-select: none;
      align-items: center;
      font-size: 10px;
      margin-top: 1px;
      color: #999;
      text-transform: uppercase;
    }

    .items {
      display: flex;
      align-items: stretch;
      margin-left: 5px;
      color: #555;
      border-left: 1px solid transparent;

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        border-right: 1px solid transparent;
        padding: 5px;
        border-radius: 0px;

        &:hover {
          background: #ececeb;
        }

        &.disabled {
          color: #ccc;
          cursor: default;
        }
      }

      .item:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }

    &.no-label {
      padding-left: 0px;
      margin-left: 0px;
      .items {
        margin-left: 0px;
      }
    }

    &:hover {
      border: 1px solid black;

      .items {
        color: #111;
        border-left: 1px solid #ececeb;
        .item {
          border-right: 1px solid #ececeb;
        }
      }
    }
  }
`;

export const mobileCSS = css`
  background-color: white;
  background-image: linear-gradient(45deg, #fafafa 25%, transparent 25%),
    linear-gradient(-45deg, #fafafa 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #fafafa 75%),
    linear-gradient(-45deg, transparent 75%, #fafafa 75%);

  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
`;
