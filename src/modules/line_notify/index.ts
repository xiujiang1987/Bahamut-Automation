import { Module, fetch } from "bahamut-automation";

export default {
    name: "Line Notify 通知",
    description: "發送 Line Notify 通知",
    async run({ shared, params, logger }) {
        if (!shared.report) {
            logger.error("請設定 report 模組");
            return;
        }

        if (!params.token) {
            logger.error("請設定 Line Notify Token (token)");
            return;
        }

        if ((await shared.report.text()).length == 0) {
            logger.log("沒有報告內容");
            return;
        }

        const msg = await shared.report.markdown();

        const response = await fetch("https://notify-api.line.me/api/notify", {
            method: "POST",
            headers: { Authorization: `Bearer ${params.token}` },
            body: new URLSearchParams({ message: `${shared.report.title}\n${msg}` }),
        });

        if (response.status === 200) {
            logger.success("已發送 Line Notify");
        } else {
            logger.error("發送 Line Notify 失敗！", response, msg);
        }
    },
} as Module;
