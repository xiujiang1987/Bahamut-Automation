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

program
    .option("-m, --mode <mode>", "設定檔執行模式 (1 or 2)")
    .option("-c, --config <path>", "設定檔位置")
    .addHelpText("after", "\nExample: bahamut-automation -m 1 -c ./config.yml")
    .action(main)
    .parse();

async function main() {
    const opts = program.opts();
    let mode = opts.mode ? +opts.mode : null;
    let config_path = opts.config || null;

    if (mode !== 1 && mode !== 2) {
        while (true) {
            mode = +(
                await ask(["選擇模式: ", "1. 設定檔執行", "2. 直接執行", ">> "].join("\n"))
            ).trim();
            if (mode === 1 || mode === 2) break;
        }
    }

    if (mode === 1) {
        if (config_path) {
            config_path = path.resolve(config_path);
        }
        while (!fs.existsSync(config_path)) {
            config_path = path.resolve(remove_quotes((await ask("請輸入設定檔位置: ")).trim()));
            if (fs.existsSync(config_path)) {
                break;
            }
            console.log("設定檔不存在", config_path);
        }

        const logger = new Logger("Automation", 3);
        const automation = BahamutAutomation.from(config_path);
        automation.setup_listeners();
        await automation.run();
    } else if (mode === 2) {
        console.log("抱歉，我還沒實作這個功能。 :(");
    }

    console.log("程式執行完畢");
    process.exit(0);
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
