export type DEPLOY_TARGET_NAME = string;

export type DeployTarget = {
  name: DEPLOY_TARGET_NAME;
  domain: string;
  dburl: string;
};
export const internal = Symbol(`[internal]`);

export type SiteSettings = {
  prasi: {
    file: {
      upload_to: DEPLOY_TARGET_NAME;
    };
    db: {
      use: "deploy-target" | "db-url";
      connect_to: DEPLOY_TARGET_NAME;
      db_url: string;
    };
  };
  deploy_targets: DeployTarget[];
};
