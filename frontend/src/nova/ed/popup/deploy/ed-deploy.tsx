import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { ChevronDown } from "lucide-react";

export const EdDeployPopup = () => {
    const p = useGlobal(EDGlobal, "EDITOR");
    const site = p.site;

    if (!site) return null;

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
        ],
    };

    const local = useLocal({
        target: site.settings.deploy_targets[0]
    });

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex mb-5 bg-gray-200">
                {site.settings.deploy_targets.map((target) => (
                    <button
                        key={target.name}
                        className={`px-4 mr-1 py-2 transition ${local.target.name === target.name
                            ? "bg-white text-black border-t border-l border-r rounded-t"
                            : "bg-gray-100 text-black hover:bg-gray-300 border border-gray-300 rounded-t"
                            }`}
                        onClick={() => {
                            local.target = target;
                            local.render();
                        }}
                    >
                        {target.name.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="px-5 rounded shadow">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Server URL:</h3>
                    <div className="flex flex-col items-end">
                        <span
                            className={`px-3 py-1 text-sm text-white rounded ${local.target.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                            {local.target.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                        <span className="text-xs text-gray-600 mt-1">{formatDate(local.target.ts)}</span>
                    </div>
                </div>
                <p className="mb-5 text-gray-800 text-xl font-medium">{`https://${local.target.domain}`}</p>

                <textarea
                    className="w-full h-16 mb-5 p-2 text-sm border rounded bg-white"
                    readOnly
                    value={`postgresql://postgres:[password]@${local.target.db.url}`}
                />

                <div className="flex gap-3 mb-5">
                    <button className="px-2 py-1 text-black border bg-white rounded hover:bg-blue-200">
                        Sync & Generate prisma.schema
                    </button>
                    <button className="px-2 py-1 text-black border bg-white rounded hover:bg-blue-200">
                        Restart Server
                    </button>
                </div>

                <div className="flex gap-2 mb-5 justify-end">
                    <button className="px-2 py-1 text-sm border text-blue-500 border-blue-500 hover:bg-blue-100">
                        Deploy
                    </button>
                    <div className="relative group">
                        <button className="px-2 py-1 text-sm border text-blue-500 border-blue-500 hover:bg-blue-100 flex flex-row align-middle">
                            To
                            <ChevronDown size={14} className="my-1 ml-1" />
                        </button>
                        <div className="absolute hidden group-hover:block bg-white border rounded shadow">
                            {site.settings.deploy_targets.filter(
                                (target) => target.name !== local.target.name
                            ).map((target) => (
                                <button
                                    key={target.name}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                                    onClick={() => {
                                        local.target = target;
                                        local.render();
                                    }}
                                >
                                    {target.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-2 text-lg font-semibold">History:</h3>
                    <ul className="list-none p-0 m-0">
                        {local.target.history.map((entry, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span className="text-sm text-gray-700">{formatDate(entry.ts)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
