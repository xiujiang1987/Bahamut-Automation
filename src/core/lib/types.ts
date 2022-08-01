import type { LaunchOptions, Page } from "playwright-core";
import Logger from "./logger.js";

export type CustomValue = any;
export type CustomOutput = any;

export type ModuleParams = Record<string, CustomValue>;

export interface BahamutAutomationConfig {
    /** 所有模組皆可存取的共用參數 */
    shared: Record<string, CustomValue>;

    /** 使用的模組及其參數，可以是內建模組的名稱或是自製模組的路徑 */
    modules: Record<string, ModuleParams>;

    /** 瀏覽器的設定，擴展自 playwright.LaunchOptions @see LaunchOptions */
    browser: LaunchOptions & { type?: "firefox" | "chromium" | "webkit" };

    [key: string]: any;
}

export interface Module {
    /** 模組名稱 */
    name?: string;

    /** 模組敘述 */
    description?: string;

    /** 模組執行函式 */
    run: (payload: {
        /** 自動化框架分配的網頁 */
        page: Page;
        /** 共用參數池，包含各模組輸出 */
        shared: Record<string, CustomValue>;
        /** 模組參數 */
        params: ModuleParams;
        /** 印 Log 的東西 */
        logger: Logger;
    }) => Promise<CustomOutput>;
}
