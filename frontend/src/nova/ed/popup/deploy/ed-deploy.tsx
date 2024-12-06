import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { ChevronDown, Plus } from "lucide-react";
import { Dropdown } from "utils/ui/dropdown";
import { useEffect } from "react";
import { DeployTarget } from "../../cprasi/lib/typings";
import { dropdownProp } from "mode-page/right/style/ui/style";
import { Popover } from "utils/ui/popover";

export const EdDeployPopup = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const site = p.site;

  if (!site) return null;

  if (!site.settings) {
    site.settings = {
      prasi: {
        file: {
          upload_to: "example-deploy-target",
        },
        db: {
          use: "deploy-target",
          connect_to: "example-deploy-target",
          db_url: "https://example-db-url.com",
        },
      },
      deploy_targets: [
        {
          name: "example-dev",
          domain: "example-dev.com",
          ts: 1633036800,
          status: "online",
          db: {
            url: "https://example-db-url-dev.com",
            orm: "prasi",
          },
          history: [
            {
              ts: 1633036800,
            },
          ],
        },
        {
          name: "example-staging",
          domain: "example-staging.com",
          ts: 1633036800,
          status: "offline",
          db: {
            url: "https://example-db-url-staging.com",
            orm: "prasi",
          },
          history: [
            {
              ts: 1633036800,
            },
          ],
        },
        {
          name: "example-prod",
          domain: "example-staging.com",
          ts: 1633036800,
          status: "offline",
          db: {
            url: "https://example-db-url-staging.com",
            orm: "prasi",
          },
          history: [
            {
              ts: 1633036800,
            },
          ],
        },
      ],
    };
  }

  const local = useLocal({
    target: site.settings.deploy_targets[0],
    options: [] as { label: string; value: string }[],
    orm: [
      { label: "prasi", value: "prasi" },
      { label: "prisma", value: "prisma" },
    ],
    popover: false,
  });

  useEffect(() => {
    local.options = site.settings!.deploy_targets.map((e) => {
      return { label: e.name, value: e.name };
    });
  }, [site.settings.deploy_targets]);

  const saveChanges = () => {
    const targetIndex = site.settings!.deploy_targets.findIndex(
      (target) => target.name === local.target.name
    );
    if (targetIndex !== -1) {
      site.settings!.deploy_targets[targetIndex] = { ...local.target };
    }
    local.render();
  };

  const createDeployment = () => {
    const userInput = window.prompt("New Deploy Target Name:");
    if (userInput) {
      site.settings!.deploy_targets.push({
        name: userInput,
        domain: "",
        ts: 0,
        status: "offline",
        db: {
          url: "",
          orm: "prasi",
        },
        history: [],
      });
    }
    local.render();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className=" w-auto min-w-6xl max-w-6xl text-sm">
      <div className="flex bg-gray-200 items-end pl-1 pt-1">
        {site.settings.deploy_targets.map((target) => (
          <button
            key={target.name}
            className={`px-2 py-1 mr-1 transition rounded-t ${
              local.target.name === target.name
                ? "bg-white text-black"
                : " text-black hover:bg-gray-300"
            }`}
            onClick={() => {
              local.target = target;
              local.render();
            }}
          >
            {target.name.toUpperCase()}
          </button>
        ))}

        <button
          onClick={createDeployment}
          className={`p-1 my-1 mr-1 transition rounded bg-white`}
        >
          <Plus size={14} className="align-middle" />
        </button>
      </div>
      <div className="rounded shadow">
        <div className="flex justify-between items-center align-middle px-1">
          <div className="">Server URL:</div>
          <div className="flex flex-col items-end align-middle">
            <span
              className={`px-3 py-1 text-white ${local.target.status === "online" ? "bg-green-700" : "bg-gray-400"}`}
            >
              {local.target.status.toLocaleUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex border-y px-1 align-middle">
          <input
            type="text"
            className={cx(
              "flex-1 outline-none rounded-none px-1 py-[2px] text-black"
            )}
            value={local.target.domain || ""}
            placeholder="example.com"
            onClick={(e) => {
              e.currentTarget.select();
            }}
            onFocus={() => {
              local.render();
            }}
            onBlur={() => {
              local.render();
            }}
            spellCheck={false}
            onChange={(e) => {
              local.target.domain = e.currentTarget.value;
              saveChanges();
            }}
          />
        </div>

        <div className="flex border-b py-2 px-2 border-slate-300 boxed flex-col items-stretch">
          <textarea
            className="text-[13px] border p-2 mb-2"
            placeholder="postgres://user:password@host:port/database"
            onChange={(e) => {
              local.target.db.url = e.target.value;
              saveChanges();
            }}
            value={`${local.target.db.url}`}
          />

          <Dropdown
            {...dropdownProp}
            items={[
              { value: "prasi", label: "prasi" },
              { value: "prisma", label: "prisma" },
            ]}
            value={local.target.db.orm}
            onChange={(v) => {
              local.target.db.orm = v as DeployTarget["db"]["orm"];
              saveChanges();
            }}
          />

          <div className="flex flex-col items-stretch justify-center mt-2">
            <div className="flex justify-between select-none">
              <button className="px-2 py-1 text-black border bg-white hover:bg-blue-200">
                DB Pull
              </button>
              <button className="px-2 py-1 text-black border bg-white hover:bg-blue-200">
                Restart Server
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center border-b p-2 border-slate-300 boxed ">
            <div className="">History:</div>

            <div className="flex gap-2 justify-end">
              <button className="px-1 py-[2px] border text-blue-500 border-blue-500 hover:bg-blue-100">
                Deploy
              </button>

              {site.settings.deploy_targets.length > 1 && (
                <div className="relative group align-middle">
                  <Popover
                    preload
                    content={
                      <div className="bg-white border rounded shadow">
                        {site.settings.deploy_targets
                          .filter((target) => target.name !== local.target.name)
                          .map((target) => (
                            <button
                              key={target.name}
                              className="block w-full text-left p-2 hover:bg-blue-500 border-b hover:text-white"
                              onClick={() => {
                                local.target = target;
                                local.render();
                              }}
                            >
                              {target.name.toUpperCase()}
                            </button>
                          ))}
                      </div>
                    }
                  >
                    <button className="px-1 py-[2px] border text-blue-500 border-blue-500 hover:bg-blue-100 flex items-center">
                      To
                      <ChevronDown size={14} className="align-middle" />
                    </button>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-auto h-[200px] border-t">
            <ul className="list-none p-0 m-0">
              {local.target.ts !== 0 && (
                <li className="flex justify-between items-center border-b py-1 px-2 border-l-4 bg-green-200 border-l-green-500">
                  <span className="text-gray-700">
                    {formatDate(local.target.ts)}
                  </span>
                </li>
              )}

              {local.target.history.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b py-1 px-2"
                >
                  <span className="text-gray-700">{formatDate(entry.ts)}</span>
                  <Popover
                    preload
                    content={
                      <div className="bg-white border rounded shadow">
                        
                            <button
                              className="block w-full text-left p-2 hover:bg-blue-500 border-b hover:text-white"
                              
                            >
                              Re-Deploy
                            </button>
                            <button
                              className="block w-full text-left p-2 hover:bg-blue-500 border-b hover:text-white"
                              
                            >
                              Delete Build
                            </button>
                          
                      </div>
                    }
                  >
                    <button className="px-2 py-1 border border-slate-300 hover:bg-blue-100 flex items-center">
                      Action
                      <ChevronDown size={14} className="align-middle" />
                    </button>
                  </Popover>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
