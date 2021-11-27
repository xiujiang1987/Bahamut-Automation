process.TZ = "Asia/Taipei";

const path = require("path");
const EventEmitter = require("events");
const countapi = require("countapi-js");
const Logger = require("./logger");
const Browser = require("./browser");
const { sleep } = require("./utils");

const VERSION = require("../../package.json").version;

class BahamutAutomation extends EventEmitter {
    constructor({ modules = [], params = {}, browser = {}, page = {} }) {
        super();
        this.browser_config = browser;
        this.page_config = page;
        this.modules = modules;
        this.params = params;

        this.logger = new Logger();

        this.start_time = null;
        this.end_time = null;

        this.setup();
    }

    setup() {
        const self = this;
        this.on("start", () => {
            self.log("開始執行巴哈姆特自動化 " + VERSION);
            countapi.update("Bahamut-Automation", "run", 1);
        });

        this.on("module_start", (module_name, module_path) => {
            self.log(`執行 ${module_name} 模組 (${module_path})`);
        });

        this.on("module_loaded", (module_name, module) => {
            self.log(`參數: ${module.parameters.map(({ name, required }) => ` ${name}${required ? "*" : ""}`).join(" ") || "無"}`);
        });

        this.on("module_finished", (module_name) => {
            self.log(`模組 ${module_name} 執行完畢\n`);
        });

        this.on("module_failed", (module_name, err) => {
            self.logger.error(`模組 ${module_name} 執行失敗\n`);
            self.logger.error(err);
        });

        this.on("finished", (outputs, time) => {
            self.log("巴哈姆特自動化執行完畢");
            self.log(`執行時間: ${second_to_time(time)}`);
            self.log("輸出:", outputs);
        });

        this.on("fatal", (err) => {
            self.logger.error("巴哈姆特自動化執行失敗");
            self.logger.error(err);

            if (self.browser) {
                self.browser.close();
            }
        });
    }

    log(...arg) {
        this.logger.log(...arg);
        this.emit("log", ...arg);
    }

    async run() {
        try {
            this.start_time = Date.now();

            this.emit("start");

            this.browser = new Browser(this.browser_config.type || "firefox", this.browser_config, this.logger);
            await this.browser.launch();

            this.emit("browser_opened");

            const outputs = {};

            for (let module_name of this.modules) {
                try {
                    const module_path = path.resolve(__dirname, "../modules", module_name);

                    if (path.isAbsolute(module_name)) {
                        module_name = path.basename(module_name);
                    }

                    this.emit("module_start", module_name, module_path);

                    const module = require(module_path);

                    this.emit("module_loaded", module_name, module);

                    const module_page = await this.browser.new_page(this.page_config);

                    const module_params = {};
                    for (const { name, required } of module.parameters) {
                        if (this.params[name] !== undefined) {
                            module_params[name] = this.params[name];
                        } else if (required) {
                            await module_page.close();
                            this.emit("module_parameter_error", module_name, name);
                            throw new Error(`模組 ${module_name} 所必須之 ${name} 參數不存在`);
                        }
                    }

                    outputs[module_name] = await module.run({
                        page: module_page,
                        outputs: outputs,
                        params: module_params,
                        logger: this.logger.next(),
                    });

                    await module_page.close();

                    this.emit("module_finished", module_name);
                } catch (err) {
                    this.emit("module_failed", module_name, err);
                }

                await sleep(1000);
            }

            await this.browser.close();

            this.end_time = Date.now();

            const time = parseInt((this.end_time - this.start_time) / 1000);

            this.emit("finished", JSON.parse(JSON.stringify(outputs)), time);

            return { outputs: JSON.parse(JSON.stringify(outputs)), time };
        } catch (err) {
            this.emit("fatal", err);
            return null;
        }
    }
}

function second_to_time(second) {
    const hour = parseInt(second / 3600);
    const minute = parseInt((second - hour * 3600) / 60);
    const second_left = second - hour * 3600 - minute * 60;

    return `${hour} 小時 ${minute} 分 ${second_left} 秒`;
}

module.exports = BahamutAutomation;
