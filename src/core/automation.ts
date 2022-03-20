import EventEmitter from "node:events";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { pathToFileURL } from "node:url";
import countapi from "countapi-js";
import yaml from "js-yaml";
import { Browser } from "./browser";
import { Logger } from "./logger";
import type { BahamutAutomationConfig, CustomOutput, Module } from "./types";
import { get_version, second_to_time } from "./utils";

process.env.TZ = "Asia/Taipei";
const dirname = url.fileURLToPath(import.meta.url);
const VERSION = get_version(dirname);

function resolve_module(id: string): { location: string; builtin: boolean } {
    const module_path = path.resolve(id);
    if (fs.existsSync(module_path)) {
        return { location: module_path, builtin: false };
    }
    return {
        location: path.resolve(dirname, "..", "..", "modules", id, "index.js"),
        builtin: true,
    };
}

export class BahamutAutomation extends EventEmitter {
    /** @name 模組設定 */
    public config: Required<BahamutAutomationConfig>;
    public logger: Logger;

    private start_time: number = null;
    private end_time: number = null;
    private browser: Browser;

    /** 建立巴哈姆特自動化實體 */
    constructor(config: BahamutAutomationConfig, logger = new Logger("Automation")) {
        super();

        this.config = {
            shared: { flags: {}, ...config?.shared },
            modules: { utils: {}, ...config?.modules },
            browser: { type: "firefox", headless: true, ...config?.browser },
        };
        this.logger = logger;

        this.on("error", (...arg: unknown[]) => this?.logger?.error(...arg));
        this.on("warn", (...arg: unknown[]) => this?.logger?.warn(...arg));
        this.on("info", (...arg: unknown[]) => this?.logger?.info(...arg));
        this.on("log", (...arg: unknown[]) => this?.logger?.log(...arg));
    }

    setup_listeners(): void {
        const self = this;
        this.on("start", () => {
            self.emit("log", `開始執行巴哈姆特自動化 ${VERSION}`);
            countapi.update("Bahamut-Automation", "run", 1);
        });

        this.on("module_start", (module_name: string, module_path: string) => {
            self.emit("log", `執行 ${module_name} 模組 (${module_path})`);
            console.group();
        });

        this.on("module_finished", (module_name: string) => {
            console.groupEnd();
            self.emit("log", `模組 ${module_name} 執行完畢`);
        });

        this.on("module_failed", (module_name: string, err: Error) => {
            console.groupEnd();
            self.emit("error", `模組 ${module_name} 執行失敗`, err);
        });

        this.on("finished", (outputs: unknown, time: number) => {
            self.emit(
                "log",
                `執行完畢 時間: ${second_to_time(time)}\n輸出: ${outputs}`,
                outputs,
                time,
            );
        });

        this.on("fatal", (err: Error) => {
            if (self.browser) {
                self.browser.close();
            }

            self.emit("error", "巴哈姆特自動化執行失敗", err);
        });
    }

    async run(): Promise<{ outputs: CustomOutput; time: number }> | null {
        try {
            this.start_time = Date.now();
            this.emit("start");

            this.browser = new Browser(this.config.browser.type || "firefox", this.config.browser);
            this.browser.on("log", (...arg: unknown[]) => this.emit("log", ...arg));
            await this.browser.launch();
            this.emit("browser_opened");

            const shared = this.config.shared;
            const outputs: Record<string, CustomOutput> = {};

            for (const [module_id, module_params] of Object.entries(this.config.modules)) {
                const page = await this.browser.new_page();

                try {
                    const { location, builtin } = resolve_module(module_id);
                    if (!fs.existsSync(location)) {
                        throw new Error(`模組 ${module_id} (${location}) 不存在`);
                    }
                    const _module = await import(pathToFileURL(location).toString());
                    const module: Module = _module.default || _module;

                    this.emit(
                        "module_start",
                        module.name || module_id,
                        builtin ? "Built-in" : location,
                    );

                    outputs[module_id] = await module.run({
                        page,
                        shared: { ...shared, ...outputs },
                        params: module_params || {},
                        logger: new Logger(module.name || module_id),
                    });

                    this.emit("module_finished", module_id);
                } catch (err) {
                    this.emit("module_failed", module_id, err);
                }

                if (page && page.close) {
                    await page.close();
                }
            }

            await this.browser.close();

            this.end_time = Date.now();
            const time = Math.floor((this.end_time - this.start_time) / 1000);
            this.emit("finished", JSON.parse(JSON.stringify(outputs)), time);

            return { outputs: JSON.parse(JSON.stringify(outputs)), time };
        } catch (err) {
            this.emit("fatal", err);
            return null;
        }
    }

    /**
     * 從設定檔建立實體
     * @param config_path 設定檔路徑
     * @returns 巴哈姆特自動化實體
     */
    static from(config_path: string): BahamutAutomation {
        switch (path.extname(config_path)) {
            case ".yml":
            case ".yaml":
                return new BahamutAutomation(
                    yaml.load(fs.readFileSync(config_path, "utf8")) as BahamutAutomationConfig,
                );
            case ".json":
                return new BahamutAutomation(
                    JSON.parse(fs.readFileSync(config_path, "utf8")) as BahamutAutomationConfig,
                );
            case ".js":
            case ".cjs":
                return new BahamutAutomation(require(config_path) as BahamutAutomationConfig);
            default:
                throw new Error("不支援的設定檔格式");
        }
    }
}

export declare interface BahamutAutomation {
    on(
        event: "error" | "success" | "warn" | "info" | "log",
        listener: (...args: unknown[]) => void,
    ): this;
    on(event: "start" | "browser_opened", listener: () => void): this;
    on(event: "module_start", listener: (module_name: string, module_path: string) => void): this;
    on(event: "module_finished", listener: (module_name: string) => void): this;
    on(event: "module_failed", listener: (module_name: string, err: Error) => void): this;
    on(event: "finished", listener: (outputs: unknown, time: number) => void): this;
    on(event: "fatal", listener: (err: Error) => void): this;
    on(event: string, listener: Function): this;
}

export default BahamutAutomation;
