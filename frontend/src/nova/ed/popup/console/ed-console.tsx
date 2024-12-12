import { EDGlobal } from "logic/ed-global";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { ChevronDown, Plus, Pencil, Sticker } from "lucide-react";
import { Dropdown } from "utils/ui/dropdown";
import { useEffect } from "react";
import { DeployTarget } from "../../cprasi/lib/typings";
import { dropdownProp } from "mode-page/right/style/ui/style";
import { Popover } from "utils/ui/popover";
import { Resizable } from "re-resizable";

export type ConsoleBuildLog = {
  source: string;
  status: "OK" | "FAILED";
  log: string[];
};

export const EdConsolePopup = () => {
  const p = useGlobal(EDGlobal, "EDITOR");

  const p_log: ConsoleBuildLog[] = [
    {
      source: "Front-End",
      status: "OK",
      log: [
        "Creating new worker instance",
        "AMD, 4 vCPUs, 16 GB RAM",
        'Using image "ubuntu-22.04-jdk-17-ndk-26.1.10909125" based on "ubuntu-2204-jammy-v20240614"',
        "Installed software:",
        "- NDK 26.1.10909125",
        "- Node.js 18.18.0",
        "- Bun 1.1.13",
        "- Yarn 1.22.21",
        "- pnpm 9.3.0",
        "- npm 9.8.1",
        "- Java 17",
        "- node-gyp 10.1.0",
        "Project environment variables:",
        "  __API_SERVER_URL=https://api.expo.dev/",
        "EAS Build environment variables:",
        "  SHELL=/bin/sh",
        "  NVM_INC=/home/expo/.nvm/versions/node/v18.18.0/include/node",
        "  JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64",
        "  PWD=/usr/local/eas-build-worker",
        "  LOGNAME=expo",
        "  SYSTEMD_EXEC_PID=840",
        "  HOME=/home/expo",
        "  LANG=en_US.UTF-8",
        "  INVOCATION_ID=6728d93330b14400a15c8967191b111f",
        "  ANDROID_NDK_HOME=/home/expo/Android/Sdk/ndk/26.1.10909125",
        "  NVM_DIR=/home/expo/.nvm",
        "  ANDROID_HOME=/home/expo/Android/Sdk",
        "  USER=expo",
        "  SHLVL=0",
        "  ANDROID_SDK_ROOT=/home/expo/Android/Sdk",
        "  JOURNAL_STREAM=8:17391",
        "  PATH=/home/expo/workingdir/bin:/home/expo/.nvm/versions/node/v18.18.0/bin:/opt/bundletool:/home/expo/Android/Sdk/build-tools/29.0.3:/home/expo/Android/Sdk/ndk/26.1.10909125:/home/expo/Android/Sdk/cmdline-tools/tools/bin:/home/expo/Android/Sdk/tools:/home/expo/Android/Sdk/tools/bin:/home/expo/Android/Sdk/platform-tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/home/expo/.bun/bin",
        "  LOGGER_LEVEL=info",
        "  NVM_BIN=/home/expo/.nvm/versions/node/v18.18.0/bin",
        "  EAS_BUILD_WORKER_DIR=/home/expo/eas-build-worker",
        "  _=/home/expo/.nvm/versions/node/v18.18.0/bin/node",
        "  CI=1",
        "  MAESTRO_DRIVER_STARTUP_TIMEOUT=120000",
        "  EAS_BUILD=true",
        "  EAS_BUILD_RUNNER=eas-build",
        "  EAS_BUILD_PLATFORM=android",
        "  NVM_NODEJS_ORG_MIRROR=http://10.4.0.203:8081",
        "  EAS_BUILD_PROFILE=staging",
        "  EAS_BUILD_GIT_COMMIT_HASH=59d987cdf0129750713cb84f219275ca6ceaa0b3",
        "  EAS_BUILD_ID=af9bc401-16b6-4559-9d0a-1a6b05e0f72e",
        "  EAS_BUILD_WORKINGDIR=/home/expo/workingdir/build",
        "  EAS_BUILD_PROJECT_ID=40fe379c-9e07-4514-8d98-6b20c2b9ed9f",
        "  EAS_BUILD_MAVEN_CACHE_URL=http://10.4.0.201:8081",
        '  GRADLE_OPTS=-Dorg.gradle.jvmargs="-Xmx14g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8" -Dorg.gradle.parallel=true -Dorg.gradle.daemon=false',
        "  EAS_BUILD_USERNAME=expo.deploy",
        "  __EAS_BUILD_ENVS_DIR=/home/expo/workingdir/env",
        "Builder is ready, starting build",
      ],
    },
    {
      source: "Back-End",
      status: "FAILED",
      log: [
        "Starting Back-End build.",
        "Resolving dependencies.",
        "Installing npm packages.",
        "Checking for outdated dependencies.",
        "Verifying environment variables.",
        "Fetching API schema definitions.",
        "Compiling TypeScript files.",
        "Generating API documentation.",
        "Linting TypeScript files.",
        "Running pre-build hooks.",
        "Validating configuration files.",
        "Building serverless deployment package.",
        "Optimizing database queries.",
        "Creating database migration scripts.",
        "Error: Missing database connection string.",
        "Attempting to fetch missing credentials.",
        "Retrying database connection.",
        "Database connection failed.",
        "Halting build process.",
        "Logging error details.",
        "Cleaning temporary files.",
        "Rolling back changes.",
        "Notifying team about build failure.",
        "Sending error logs to monitoring service.",
        "Marking build as failed in dashboard.",
        "Preparing error report.",
        "Attempting to restart build process.",
        "Restart attempt failed.",
        "Updating build status to FAILED.",
        "Investigating error source.",
        "Found misconfigured environment variable.",
        "Correcting configuration.",
        "Error persists after correction.",
        "Consulting with development team.",
        "Reverting code to previous commit.",
        "Build process aborted.",
        "Build marked as FAILED.",
        "Reviewing system logs.",
        "Issuing downtime alert.",
        "Pausing CI/CD pipeline.",
        "Scheduling system maintenance.",
        "Documenting error for future reference.",
        "Preparing post-mortem analysis.",
        "Back-End build failed.",
      ],
    },
    {
      source: "TypeScript",
      status: "OK",
      log: [
        "Starting TypeScript build.",
        "Reading tsconfig.json.",
        "Checking type definitions in `src/index.ts`.",
        "Checking type definitions in `src/utils/helpers.ts`.",
        "Resolving module imports.",
        "Transpiling TypeScript to JavaScript.",
        "Analyzing type coverage.",
        "Running unit tests.",
        "Creating test coverage report.",
        "No type errors found.",
        "Generating source maps.",
        "Validating generated code.",
        "Running integration tests.",
        "Compiling additional modules.",
        "Linting TypeScript files.",
        "Fixing linting warnings.",
        "Optimizing compiled code.",
        "Packaging TypeScript output.",
        "Preparing output for deployment.",
        "Performing static code analysis.",
        "Cleaning temporary files.",
        "Signing compiled files.",
        "Uploading artifacts to repository.",
        "Generating API documentation.",
        "Verifying type safety in API definitions.",
        "Checking for circular dependencies.",
        "Updating project metadata.",
        "Updating TypeScript dependency versions.",
        "Rebuilding project.",
        "Build process complete.",
        "Finalizing TypeScript build.",
        "Logging build summary.",
        "TypeScript build completed successfully.",
      ],
    },
    {
      source: "TailWind",
      status: "FAILED",
      log: [
        "Starting Tailwind CSS build.",
        "Loading Tailwind configuration.",
        "Reading `tailwind.config.js`.",
        "Scanning project files for utility classes.",
        "Generating base styles.",
        "Generating component styles.",
        "Generating utility styles.",
        "Error: Invalid class name detected in `app.css`.",
        "Aborting CSS generation.",
        "Cleaning temporary files.",
        "Notifying team about build failure.",
        "Updating build status to FAILED.",
        "Logging error details.",
        "Preparing error report.",
        "Rebuilding Tailwind project.",
        "Error persists after rebuild.",
        "Consulting with front-end team.",
        "Build process aborted.",
        "Tailwind CSS build failed.",
      ],
    },
  ];
  const local = useLocal({
    target: null as ConsoleBuildLog | null,
  });

  useEffect(() => {
    if (p_log.length === 0) return;
    local.target = p_log[0];
    local.render();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <Resizable
      defaultSize={{ width: 500, height: 500 }}
      minHeight={300}
      minWidth={500}
    >
      <div className="flex flex-col h-full w-full">
        {/* Tabs */}
        <div className="flex bg-gray-200 items-end pl-1 pt-1">
          {p_log.map((target) => (
            <button
              key={target.source}
              className={`px-2 py-1 mr-1 transition rounded-t align-middle  flex items-center justify-between ${
                local.target?.source === target.source
                  ? "bg-white text-black"
                  : "text-black hover:bg-gray-300"
              }`}
              onClick={() => {
                local.target = target;
                local.render();
              }}
            >
              <span>{target.source}</span>
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="rounded shadow py-1 pl-1 bg-white">
          <div className="flex justify-between items-center">
            <span>Status:</span>

            {/* <Space/> */}

            <div>
              <button className="px-3 py-1 text-black border bg-white hover:bg-blue-200 mr-[4px]">
                Restart
              </button>
              <span
                className={`px-3 py-2 text-white ${
                  local.target?.status === "OK" ? "bg-green-700" : "bg-red-500"
                }`}
              >
                {local.target?.status.toLocaleUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-hidden bg-gray-900">
          <div className="h-full overflow-y-auto">
            <ul className="list-none p-0 m-0 font-mono text-sm leading-6">
              {local.target?.log.map((entry, index) => (
                <li
                  key={index}
                  className="flex gap-3 px-2 align-top items-start"
                >
                  <span className="text-gray-500 text-right w-[20px] min-w-[20px] inline-block text-[10px]">
                    {index + 1}
                  </span>
                  <pre className="text-gray-200 m-0 p-0 whitespace-pre-wrap break-words text-[10px]">
                    {entry}
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Resizable>
  );
};
