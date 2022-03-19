import type { LaunchOptions, Page } from "playwright";
import Logger from "./logger";

export interface BahamutAutomationConfig {
    /** 所有模組皆可存取的共用參數 */
    shared?: Record<string, any>;

    /** 使用的模組及其參數，可以是內建模組的名稱或是自製模組的路徑 */
    modules?: Record<string, Record<string, any>>;

    /** 瀏覽器的設定，擴展自 playwright.LaunchOptions @see LaunchOptions */
    browser?: LaunchOptions & { type?: "firefox" | "chromium" | "webkit" };
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
        shared: Record<string, any>;
        /** 模組參數 */
        params: Record<string, any>;
        /** 印 Log 的東西 */
        logger: Logger;
    }) => Promise<any>;
}
