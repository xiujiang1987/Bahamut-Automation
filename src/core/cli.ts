import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { program } from "commander";
import BahamutAutomation from "./automation";
import Logger from "./logger";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const package_json = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../../package.json"), "utf8"),
);

program
    .version(package_json.version, "-V, --version", "版本資訊")
    // .option("-m, --mode <mode>", "設定檔執行模式 (1 或 2)")
    .option("-c, --config <path>", "設定檔位置")
    .addHelpText("after", "\n範例: bahamut-automation -m 1 -c ./config.yml")
    .action(run)
    .parse();

async function run() {
    const logger = new Logger("CLI");
    try {
        const opts = program.opts();

        if (!opts.config) {
            throw new Error("請輸入設定檔位置");
        }

        const config_path = path.resolve(opts.config);

        if (!fs.existsSync(config_path)) {
            throw new Error(`設定檔 "${config_path}" 不存在`);
        }

        const automation = BahamutAutomation.from(config_path);
        automation.setup_listeners();
        await automation.run();

        logger.log("程式執行完畢");
        process.exit(0);
    } catch (err) {
        logger.error((err as Error).message);
        logger.info("查看 --help 取得更多資訊");
        logger.info("或於以下管道尋求支援：");
        logger.info("    Discord: https://discord.gg/Q2yWzcgv");
        logger.info(
            "    GitLab Issues: https://gitlab.com/JacobLinCool/bahamut-automation/-/issues",
        );
        process.exit(1);
    }
}

function ask(question = ""): Promise<string> {
    return new Promise((resolve) => readline.question(question, resolve));
}

function remove_quotes(str: string): string {
    if (
        str &&
        ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'")))
    ) {
        return str.substring(1, str.length - 1);
    }
    return str;
}
