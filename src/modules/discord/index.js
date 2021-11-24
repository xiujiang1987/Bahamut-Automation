const fetch = require("node-fetch");

exports.parameters = [
    {
        name: "dc_url",
        required: true,
    },
];

exports.run = async ({ outputs, params, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[Discord]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[Discord]\u001b[m", ...args);
    const info = (...args) => logger.info("\u001b[95m[Discord]\u001b[m", ...args);

    const { dc_url } = params;

    if (!outputs.report) {
        error("請設定 report 模組");
        return;
    }

    if (!dc_url) {
        error("請設定 Discord Webhook (dc_url)");
        return;
    }

    const msg = (await outputs.report.markdown()).replace(/^#+([^#].*)/gm, () => `**${RegExp.$1}**`);

    const { ok } = await fetch(dc_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: null,
            embeds: [
                {
                    title: outputs.report.title,
                    color: 1146518,
                    description: msg,
                },
            ],
        }),
    });

    if (ok) {
        log("已發送 Discord 報告！");
    } else {
        info(msg);
        error("發送 Discord 報告失敗！");
    }
};
