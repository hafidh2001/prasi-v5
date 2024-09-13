import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocal } from "../../../utils/react/use-local";
import { PageTree } from "./page-tree";
dayjs.extend(relativeTime);
export const EdPageHistory = ({ tree }: { tree: PageTree }) => {
  const local = useLocal(
    {
      history: null as null | Awaited<ReturnType<typeof tree.history>>,
      loading: false,
      timeout: null as any,
    },
    () => {
      reload();
      tree.before_update = (do_update) => {
        if (local.history && local.history.redo.length > 0) {
          if (confirm("Modifying will remove all REDO. Are you sure ?")) {
            do_update();
          }
        } else {
          do_update();
        }
      };
      const unlisten = tree.listen(() => {
        reload();
      });
      return () => {
        unlisten();
        tree.before_update = null;
      };
    }
  );

  const reload = async () => {
    if (!local.loading) {
      local.loading = true;
      local.render();
      local.history = await tree.history();
      local.loading = false;
      local.render();
    }
  };

  return (
    <div
      className={cx(
        "relative overflow-auto flex-1",
        css`
          .size {
            font-size: 11px;
            .box {
              margin-right: 10px;
              padding: 0px 5px;
            }
          }
          .undo,
          .redo {
            width: 40px;
            text-align: center;
          }
        `
      )}
    >
      {!!local.history && (
        <div className="absolute inset-0 flex flex-col items-stretch">
          {local.history.redo?.map((e, idx) => (
            <div
              key={idx}
              className={cx(
                "border-b text-sm px-2 py-1 items-center cursor-pointer hover:bg-blue-50 flex",
                css`
                  .redo {
                    opacity: 0.3;
                  }
                  &:hover {
                    .redo {
                      opacity: 1;
                    }
                  }
                `
              )}
              onClick={() => {
                tree.redo(local.history!.redo.length - idx);
              }}
            >
              <div className="flex-1">
                {dayjs(e.ts).from(local.history!.ts)}
              </div>
              <div className="flex justify-center items-center size">
                <div className="box">{e.size}</div>
              </div>
              <div className="text-xs redo border bg-green-100 border-green-700 text-green-700 px-1">
                REDO
              </div>
            </div>
          ))}
          {local.history.undo?.map((e, idx) => {
            if (idx === (local.history?.undo || []).length - 1) return null;
            return (
              <div
                key={idx}
                className={cx(
                  "border-b text-sm px-2 py-1 items-center cursor-pointer hover:bg-blue-50 flex",
                  css`
                    .undo {
                      opacity: 0.3;
                    }
                    &:hover {
                      .undo {
                        opacity: 1;
                        background: white;
                      }
                    }
                  `
                )}
                onClick={() => {
                  tree.undo(idx + 1);
                }}
              >
                <div className="flex-1">
                  {dayjs(e.ts).from(local.history!.ts)}
                </div>
                <div className="flex justify-center items-center size">
                  <div className="box">{e.size}</div>
                </div>
                <div className="text-xs undo border bg-purple-100 border-purple-700 text-purple-700 px-1">
                  UNDO
                </div>
              </div>
            );
          })}
        </div>
      )}

      {local.loading && (
        <div
          className={cx(
            "absolute inset-0 flex items-center justify-center",
            css`
              svg {
                width: 50px;
                height: 50px;
              }
            `
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path
              fill="#1F5FFF"
              stroke="#1F5FFF"
              strokeWidth="15"
              d="M25 85H55V115H25z"
            >
              <animate
                attributeName="opacity"
                begin="-0.4"
                calcMode="spline"
                dur="2"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                values="1;0;1;"
              ></animate>
            </path>
            <path
              fill="#1F5FFF"
              stroke="#1F5FFF"
              strokeWidth="15"
              d="M85 85H115V115H85z"
            >
              <animate
                attributeName="opacity"
                begin="-0.2"
                calcMode="spline"
                dur="2"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                values="1;0;1;"
              ></animate>
            </path>
            <path
              fill="#1F5FFF"
              stroke="#1F5FFF"
              strokeWidth="15"
              d="M145 85H175V115H145z"
            >
              <animate
                attributeName="opacity"
                begin="0"
                calcMode="spline"
                dur="2"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                values="1;0;1;"
              ></animate>
            </path>
          </svg>
        </div>
      )}
    </div>
  );
};
