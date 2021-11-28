import Logger from "./logger";
import type { Page, LaunchOptions } from "playwright";

export type BrowserType = "firefox" | "chromium" | "webkit";

export interface BrowserConfig extends LaunchOptions {
    type?: BrowserType;
}

export interface BahamutAutomationConfig {
    modules: string[];
    params: { [key: string]: any };
    browser: BrowserConfig;
}

export interface ModuleParams {
    name: string;
    required?: boolean;

    [key: string]: any;
}

export interface Module {
    parameters: ModuleParams[];

    run({ page, outputs, params, logger }: { page: Page; outputs: any; params: any; logger: Logger }): Promise<any>;
}
