const fs = require("fs");
const path = require("path");
const Automation = require("./core");

const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

main();

async function main() {
    const args = parsed_args();

    if (args["help"] || args["h"]) {
        help();
        process.exit(0);
    }

    let mode = (args["mode"] ? +args["mode"][0] : null) || (args["m"] ? +args["m"][0] : null);
    if (mode !== 1 && mode !== 2) {
        while (true) {
            mode = +(await ask(["選擇模式: ", "1. 設定檔執行", "2. 直接執行", ">> "].join("\n")));
            if (mode === 1 || mode === 2) break;
        }
    }

    if (mode === 1) {
        let config_path = (args["config"] ? args["config"][0] : null) || (args["c"] ? args["c"][0] : null);
        if (config_path) config_path = path.resolve(process.cwd(), config_path);
        if (!fs.existsSync(config_path)) {
            while (true) {
                config_path = path.resolve(process.cwd(), await ask("請輸入設定檔位置: "));
                if (fs.existsSync(config_path)) break;
                console.log("設定檔不存在:", config_path);
            }
        }

        let config = require(config_path);

        const automation = new Automation(config);
        await automation.run();
    } else if (mode === 2) {
        console.log("抱歉，我還沒實作這個功能。 :(");
    }

    console.log("程式執行完畢");
    process.exit(0);
}

function ask(question = "") {
    return new Promise((resolve) => readline.question(question, resolve));
}

function parsed_args() {
    const args = process.argv.slice(2);

    const parsed = {};

    let now = null;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith("--")) {
            now = arg.slice(2);
            if (!parsed[now]) parsed[now] = [];
        } else if (arg.startsWith("-")) {
            now = arg.slice(1);
            if (!parsed[now]) parsed[now] = [];
        } else if (now) {
            parsed[now].push(arg);
        }
    }

    return parsed;
}

function help() {
    console.log("參數: [--mode=1|2] [--config=path] [--help]");
    console.log("  --mode (-m): 設定檔執行模式");
    console.log("  --config (-c): 設定檔位置");
    console.log("  --help (-h): 顯示此說明");
}
