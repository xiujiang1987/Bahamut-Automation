process.TZ = "Asia/Taipei";

const path = require("path");
const countapi = require("countapi-js");
const Logger = require("./logger");
const { sentry_init, finish_transaction } = require("./sentry");
const { catch_fatal, catch_error } = require("./catcher");
const { open_browser, new_page, close_all } = require("./browser");
const { sleep } = require("./utils");

const VERSION = require("../../package.json").version;

async function automation({ browser = {}, page = {}, modules = [], params = {} }) {
    try {
        const logger = new Logger();

        logger.log("開始執行巴哈姆特自動化 " + VERSION);

        countapi.update("Bahamut-Automation", "run", 1);

        sentry_init();

        await open_browser(browser.type || "firefox", browser);

        const outputs = {};

        for (let module_name of modules) {
            try {
                const module_path = path.resolve(__dirname, "../modules", module_name);

                if (path.isAbsolute(module_name)) {
                    module_name = path.basename(module_name);
                }

                logger.log(`執行 ${module_name} 模組`);
                const module = require(module_path);

                const module_page = await new_page(page);

                const module_params = {};
                for (const { name, required } of module.parameters) {
                    if (params[name] !== undefined) {
                        module_params[name] = params[name];
                    } else if (required) {
                        await module_page.close();
                        throw new Error(`模組 ${module_name} 所必須之 ${name} 參數不存在`);
                    }
                }

                outputs[module_name] = await module.run({
                    page: module_page,
                    outputs: outputs,
                    params: module_params,
                    logger: logger.next(),
                });

                await module_page.close();

                logger.log(`模組 ${module_name} 執行完畢\n`);
            } catch (err) {
                catch_error(err);
                logger.error(`模組 ${module_name} 執行失敗`);
            }

            await sleep(1000);
        }

        await close_all();

        logger.log("巴哈姆特自動化執行完畢");

        finish_transaction();

        return JSON.parse(JSON.stringify(outputs));
    } catch (err) {
        catch_fatal(err);
        return null;
    }
}

module.exports = automation;
