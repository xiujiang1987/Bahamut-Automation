const fs = require("fs");
const path = require("path");
const automation = require("./core");

const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

main();

async function main() {
    let mode = null;
    while (true) {
        mode = +(await ask(["選擇模式: ", "1. 設定檔執行", "2. 直接執行", ">> "].join("\n")));
        if (mode === 1 || mode === 2) break;
    }

    if (mode === 1) {
        let config_path = null;
        while (true) {
            config_path = path.resolve(process.cwd(), await ask("請輸入設定檔位置: "));
            if (fs.existsSync(config_path)) break;
            console.log("設定檔不存在:", config_path);
        }

        let config = require(config_path);
        await automation(config);
    } else if (mode === 2) {
        console.log("抱歉，我還沒實作這個功能。 :(");
    }

    console.log("程式執行完畢");
    process.exit(0);
}

function ask(question = "") {
    return new Promise((resolve) => readline.question(question, resolve));
}
