import fetch from "node-fetch";

export const name = "DC 通知";
export const description = "發送通知至 Discord 聊天室";
export const run = async ({ shared, params, logger }) => {
    const { webhook } = params;

    if (!shared.report) {
        logger.error("請設定 report 模組");
        return;
    }

    if (!webhook) {
        logger.error("請設定 Discord Webhook (webhook)");
        return;
    }

    if ((await shared.report.text()).length == 0) {
        logger.log("沒有報告內容");
        return;
    }

    const msg = (await shared.report.markdown()).replace(
        /^#+([^#].*)/gm,
        (match) => `**${match.replace(/^#+/, "").trim()}**`,
    );

    const { ok } = await fetch(webhook, {
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
};
