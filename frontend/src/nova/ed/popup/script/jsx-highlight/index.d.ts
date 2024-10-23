export interface WorkerStringContainer {
    worker: string;
}
export interface Config {
    /**
     * 自定义 typescript.min.js url
     * - 只在worker来源为 json 模式下生效
     */
    customTypescriptUrl?: string;
}
/**
 * 高亮
 */
export declare class MonacoJsxSyntaxHighlight {
    private worker;
    private monaco;
    constructor(worker: string | Worker | WorkerStringContainer, monaco: any, config?: Config);
    private createWorkerFromPureString;
    highlighterBuilder: (context: {
        editor: any;
        filePath?: string | undefined;
    }) => {
        highlighter: (code?: string | undefined) => void;
        dispose: () => void;
    };
}
export { getWorker } from './get-worker';
export { analysis } from './worker/analysis';
