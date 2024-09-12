import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGlobal } from "../../utils/react/use-global";
import { jscript } from "../../utils/script/jscript";
import { w } from "../../utils/types/general";
import { isLocalhost } from "../../utils/ui/is-localhost";
import { Loading } from "../../utils/ui/loading";
import { EdLeft } from "./ed-left";
import { EDGlobal } from "./logic/ed-global";
import { iconVSCode } from "./ui/icons";

export const EdBase = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const vscode_url = isLocalhost()
    ? "http://localhost:8443?"
    : "https://prasi-vsc.avolut.com/?tkn=prasi&";

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
        <Panel></Panel>
        <PanelResizeHandle />
        <Panel defaultSize={25}></Panel>
      </PanelGroup>
    </div>
  );
};

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
