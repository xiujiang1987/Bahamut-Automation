import EventEmitter from "node:events";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import countapi from "countapi-js";
import { Browser, BrowserContext } from "playwright-core";
import { VERBOSE } from "./constants.js";
import { launch } from "./launcher.js";
import { Logger } from "./logger.js";
import type { BahamutAutomationConfig, CustomOutput, Module } from "./types.js";
import { get_root, get_version, second_to_time } from "./utils.js";

const VERSION = get_version(get_root());

export class BahamutAutomation extends EventEmitter {
    public config: BahamutAutomationConfig;

    private start_time: number = null;
    private end_time: number = null;
    private browser: Browser;
    private context: BrowserContext;

    constructor(config: BahamutAutomationConfig) {
        super();

        this.config = {
            shared: { flags: {}, ...config?.shared },
            modules: { utils: {}, ...config?.modules },
            browser: { type: "firefox", headless: true, ...config?.browser },
        };
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
            self.emit("log", `執行完畢 時間: ${second_to_time(time)}`);
            self.emit("log", `執行完畢 輸出:`, JSON.stringify(outputs, null, 4));
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

            const { browser, context } = await launch(
                this.config.browser.type,
                this.config.browser,
            );

            this.browser = browser;
            this.context = context;

            const shared = this.config.shared;
            const outputs: Record<string, CustomOutput> = {};

            for (const module_id in this.config.modules) {
                const module_params = this.config.modules[module_id];
                const page = await this.context.newPage();

                try {
                    const { location, builtin } = resolve_module(module_id);
                    if (!fs.existsSync(location)) {
                        throw new Error(`模組 ${module_id} (${location}) 不存在`);
                    }

                    if (VERBOSE) {
                        console.log(`importing ${module_id} from ${pathToFileURL(location).href}`);
                    }

                    const _module = await import(pathToFileURL(location).href);
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
}

export declare interface BahamutAutomation {
    on(
        event: "error" | "success" | "warn" | "info" | "log",
        listener: (...args: unknown[]) => void,
    ): this;
    on(event: "start", listener: () => void): this;
    on(event: "module_start", listener: (module_name: string, module_path: string) => void): this;
    on(event: "module_finished", listener: (module_name: string) => void): this;
    on(event: "module_failed", listener: (module_name: string, err: Error) => void): this;
    on(event: "finished", listener: (outputs: unknown, time: number) => void): this;
    on(event: "fatal", listener: (err: Error) => void): this;
    on(event: string, listener: Function): this;
}

export default BahamutAutomation;

function resolve_module(id: string): { location: string; builtin: boolean } {
    const module_path = path.resolve(id);
    if (fs.existsSync(module_path)) {
        return { location: module_path, builtin: false };
    }
    return {
        location: path.resolve(__dirname, "..", "..", "modules", id, "index.js"),
        builtin: true,
    };
}
