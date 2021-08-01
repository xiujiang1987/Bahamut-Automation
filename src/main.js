const { sentryInit } = require("./sentry");
const { catchFatal, catchError } = require("./error");
const { log, indentedLog } = require("./log");
const { Browser, Page } = require("./browser");

async function main({ config = {}, modules = [], ...params }) {
    try {
        log("開始執行巴哈姆特自動化");

        // 初始化錯誤追蹤
        sentryInit();

        // 獲取瀏覽器
        const browser = await Browser(config);

        // 模組輸出
        const outputs = {};

        // 依序執行模組
        for (const moduleName of modules) {
            try {
                log(`\n正在執行 ${moduleName} 模組`);
                const module = require(`./modules/${moduleName}`);

                // 新增分頁
                const page = await Page();

                // 建構模組參數
                const moduleParams = {};
                module.parameters.forEach(({ name, required }) => {
                    if (params[name] !== undefined) {
                        moduleParams[name] = params[name];
                    } else if (required) {
                        throw new Error(`模組 ${moduleName} 所必須之 ${name} 參數不存在`);
                    }
                });

                // 執行模組
                outputs[moduleName] = await module.run({ page, outputs, params: moduleParams, catchError, log: indentedLog(2) });

                // 關閉分頁
                await page.close();

                log(`模組 ${moduleName} 執行完畢\n`);
            } catch (err) {
                catchError(err);
                log(`模組 ${moduleName} 執行失敗`);
            }
        }

        // 關閉瀏覽器
        await browser.close();

        log("巴哈姆特自動化執行完畢");

        // 輸出模組輸出
        return JSON.parse(JSON.stringify(outputs));
    } catch (err) {
        catchFatal(err);
    }
}

exports.main = main;
