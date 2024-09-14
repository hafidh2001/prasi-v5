import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocal } from "../../../utils/react/use-local";
import { PageTree } from "./load-page-tree";
import { useEffect } from "react";
import { LoadingSpinner } from "../../../utils/ui/loading";
import { CompTree } from "./load-comp-tree";
dayjs.extend(relativeTime);

export const EdTreeHistory = ({ tree }: { tree: PageTree | CompTree }) => {
  const local = useLocal(
    {
      history: null as null | Awaited<ReturnType<typeof tree.history>>,
      loading: false,
      timeout: null as any,
      unlisten: () => {},
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
      local.unlisten = tree.listen(() => {
        reload();
      });
    }
  );

  useEffect(() => {
    return () => {
      local.unlisten();
      tree.before_update = null;
    };
  }, []);

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
                  "border-b bg-purple-50 text-sm px-2 py-1 items-center cursor-pointer hover:bg-blue-50 flex",
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
                <div className="text-xs undo border bg-white border-purple-700 text-purple-700 px-1">
                  UNDO
                </div>
              </div>
            );
          })}
        </div>
      )}

      {local.loading && (
        <div
          className={cx("absolute inset-0 flex items-center justify-center")}
        >
          <LoadingSpinner color="blue" />
        </div>
      )}
    </div>
  );
};
