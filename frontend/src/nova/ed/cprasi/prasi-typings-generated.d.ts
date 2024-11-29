declare module "cprasi" {
    import { FC } from "react";
    export const CPrasi: FC<{
        id: string;
        size?: string;
        name: string;
    }>;
}
declare module "lib/typings" {
    export type DEPLOY_TARGET_NAME = string;
    export type DeployTarget = {
        name: DEPLOY_TARGET_NAME;
        domain: string;
        dburl: string;
    };
    export const internal: unique symbol;
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
}
declare module "lib/prasi-site" {
    import { ESite } from "logic/types";
    export const prasi_site: ESite;
}
declare module "lib/prasi-db/db-typings" {
    import type { Prisma as PrasiDB, PrismaClient as PrasiDBClient } from "prasi-prisma";
    export type PrasiDBEditor = PrasiDBClient & {
        _batch: {
            update: <T extends PrasiDB.ModelName>(batch: {
                table: T;
                data: Exclude<Parameters<PrasiDBClient[T]["update"]>[0], undefined>["data"];
                where: Exclude<Parameters<PrasiDBClient[T]["findMany"]>[0], undefined>["where"];
            }[]) => Promise<void>;
            upsert: <T extends PrasiDB.ModelName>(arg: {
                table: T;
                where: Exclude<Parameters<PrasiDBClient[T]["findMany"]>[0], undefined>["where"];
                data: Exclude<Parameters<PrasiDBClient[T]["create"]>[0], undefined>["data"][];
                mode?: "field" | "relation";
            }) => Promise<void>;
        };
        _schema: {
            tables: () => Promise<PrasiDB.ModelName[]>;
            columns: (table: PrasiDB.ModelName) => Promise<Record<string, {
                is_pk: boolean;
                type: string;
                optional: boolean;
                db_type: string;
                default?: any;
            }>>;
            rels: (table: PrasiDB.ModelName) => Promise<Record<string, {
                type: "has-many" | "has-one";
                to: {
                    table: PrasiDB.ModelName;
                    fields: string[];
                };
                from: {
                    table: PrasiDB.ModelName;
                    fields: string[];
                };
            }>>;
        };
    };
}
declare module "lib/prasi" {
    import { PrasiDBEditor } from "lib/prasi-db/db-typings";
    export type { DeployTarget, SiteSettings } from "lib/typings";
    export const prasi: {
        site: ESite;
        db: PrasiDBEditor;
    };
}
declare module "lib/prasi-db/db-inspect" {
    export type DBInspectTable = {
        columns: Record<string, {
            is_pk: boolean;
            type: string;
            optional: boolean;
            db_type: string;
            default?: any;
        }>;
        relations: Record<string, DBHasManyType | DBHasOneType>;
    };
    export type DBHasManyType = {
        type: "has-many";
        to: {
            table: string;
            fields: string[];
        };
        from: {
            table: string;
            fields: string[];
        };
    };
    export type DBHasOneType = {
        type: "has-one";
        to: {
            table: string;
            fields: string[];
        };
        from: {
            table: string;
            fields: string[];
        };
    };
    export type DBInspectResult = Record<string, DBInspectTable>;
}
