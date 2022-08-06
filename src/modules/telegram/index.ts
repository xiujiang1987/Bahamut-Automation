import { Module, fetch } from "bahamut-automation";

export default {
    name: "Telegram 通知",
    description: "透過 Telegram 機器人發送通知",
    async run({ shared, params, logger }) {
        if (!shared.report) {
            logger.error("請設定 report 模組");
            return;
        }

        if (!params.channel) {
            logger.error("請設定 Telegram Channel ID (channel)");
            return;
        }

        if ((await shared.report.text()).length === 0) {
            logger.info("沒有報告內容");
            return;
        }

        const msg = ((await shared.report.markdown()) as string).replace(
            /^#+([^#].*)/gm,
            (match) => `**${match.replace(/^#+/, "").trim()}**`,
        );

        const { ok } = await fetch("https://automia.jacob.workers.dev/", {
            method: "POST",
            body: JSON.stringify({ id: params.channel, send: msg }),
        });

        if (ok) {
            logger.success("已發送 Telegram 報告！");
        } else {
            logger.error(msg);
            logger.error("發送 Telegram 報告失敗！");
        }
    },
} as Module;
