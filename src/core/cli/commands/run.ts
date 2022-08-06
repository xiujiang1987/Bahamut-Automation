import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Command, OptionValues } from "commander";
import {
    BahamutAutomation,
    BahamutAutomationConfig,
    LINK,
    Logger,
    VERBOSE,
    deep_merge,
    default_config,
    fetch,
    parse_config,
} from "../../lib/index.js";

export async function run(opts: OptionValues, cmd: Command) {
    const logger = new Logger("CLI");
    try {
        const config: BahamutAutomationConfig = { ...default_config };

        if (!opts.config || opts.config.length === 0) {
            throw new Error("請輸入設定檔位置");
        }

        for (let config_path of opts.config) {
            try {
                const url = new URL(config_path);

                if (VERBOSE) {
                    logger.log("Trying to load config from URL", url.href);
                }

                const file = await fetch(url.href).then((res) => res.text());

                const temp = path.resolve(
                    os.tmpdir(),
                    `ba-config-${url.href.replace(/[^a-zA-Z0-9]/g, "-")}.yml`,
                );
                fs.writeFileSync(temp, file);
                config_path = temp;

                if (VERBOSE) {
                    logger.log("Config downloaded", temp);
                }
            } catch (err) {
                if (VERBOSE) {
                    logger.info("Config is not constructable from URL", (err as Error).message);
                }
            }

            if (!fs.existsSync(config_path)) {
                throw new Error(`設定檔 "${config_path}" 不存在`);
            }
            try {
                const layer = await parse_config(config_path);
                config.shared = { ...config.shared, ...layer.shared };
                config.modules = layer.modules;
                deep_merge(config.browser, layer.browser);
            } catch (err) {
                if (VERBOSE) {
                    logger.error(err);
                }
                throw new Error(`設定檔 ${config_path} 解析失敗`);
            }
        }

        if (Array.isArray(opts.override)) {
            for (const override of opts.override) {
                const [path, value] = override.split("=") as [string, string];
                const parts = path.split(".");
                let field = config;
                for (let i = 0; i < parts.length; i++) {
                    if (i < parts.length - 1) {
                        if (field[parts[i]] === undefined) {
                            field[parts[i]] = {};
                        }
                        field = field[parts[i]];
                    } else {
                        field[parts[i]] = value;
                    }
                }

                if (VERBOSE) {
                    logger.info(`Override ${path} = ${value}`);
                }
            }
        }

        const automation_logger = new Logger("Automation");
        const automation = new BahamutAutomation(config);
        automation.setup_listeners();

        automation.on("log", (...args: unknown[]) => {
            automation_logger.log(...args);
        });

        automation.on("error", (...args: unknown[]) => {
            automation_logger.error(...args);
        });

        await automation.run();

        logger.log("程式執行完畢");
        process.exit(0);
    } catch (err) {
        logger.error((err as Error).message);
        logger.info("查看 --help 取得更多資訊");
        logger.info("或於以下管道尋求支援：");
        logger.info(`    Discord: ${LINK.DISCORD}`);
        logger.info(`    GitLab Issues: ${LINK.GITLAB}/-/issues`);
        process.exit(1);
    }
}
