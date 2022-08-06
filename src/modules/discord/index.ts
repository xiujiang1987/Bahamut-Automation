import { Module, fetch } from "bahamut-automation";

export default {
    name: "Discord 通知",
    description: "發送通知至 Discord 聊天室",
    async run({ shared, params, logger }) {
        if (!shared.report) {
            logger.error("請設定 report 模組");
            return;
        }

        if (!params.webhook) {
            logger.error("請設定 Discord Webhook (webhook)");
            return;
        }

        if ((await shared.report.text()).length == 0) {
            logger.log("沒有報告內容");
            return;
        }

        const msg = ((await shared.report.markdown()) as string).replace(
            /^#+([^#].*)/gm,
            (match) => `**${match.replace(/^#+/, "").trim()}**`,
        );

        const { ok } = await fetch(params.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: null,
                embeds: [{ title: shared.report.title, color: 1146518, description: msg }],
            }),
        });

        if (ok) {
            logger.success("已發送 Discord 報告！");
        } else {
            logger.error(msg);
            logger.error("發送 Discord 報告失敗！");
        }
    },
} as Module;
