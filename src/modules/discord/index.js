const fetch = require("node-fetch");

exports.parameters = [
    {
        name: "dc_url",
        required: true,
    },
    {
        name: "dc_ignore",
        required: false,
    },
];

const DEFAULT_CONFIG = {
    title: "執行報告 $time$",
    ignore: ["login", "logout", "report", "telegram", "discord"],
};

exports.run = async ({ outputs, params, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[Discord]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[Discord]\u001b[m", ...args);

    const { dc_url } = params;

    // 合併預設值
    const config = Object.assign(
        {},
        DEFAULT_CONFIG,
        JSON.parse(
            JSON.stringify({
                ignore: params.dc_ignore,
            })
        )
    );
    if (typeof config.ignore === "string") config.ignore = config.ignore.split(",");

    const msg = await message(outputs, config, error, log);
    const { ok } = await fetch(dc_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: null,
            embeds: [
                {
                    title: `${replace(config.title)}`,
                    color: 1146518,
                    description: msg,
                },
            ],
        }),
    });
    if (ok) log("已發送 Discord 報告！");
    else {
        log(msg);
        logger.error("發送 Discord 報告失敗！");
    }
};

async function message(outputs, config, error, log) {
    let body = "";
    for (let key in outputs) {
        if (config.ignore.includes(key)) continue;
        if (typeof outputs[key] === "function") continue;
        if (!outputs[key]) continue;
        try {
            const output = outputs[key];

            if (output.report) {
                if (typeof output.report === "string") {
                    body += `${output.report}\n`;
                } else if (typeof output.report === "function") {
                    let b = await output.report(JSON.parse(JSON.stringify(output)));

                    b = b.replace(/\*\*\*([^]+?)\*\*\*/g, "<bi>$1</bi>");
                    b = b.replace(/\*\*([^]+?)\*\*/g, "<b>$1</b>");
                    b = b.replace(/\*([^]*?)\*/g, "<i>$1</i>");
                    b = b.replace(/\_([^]*?)\_/g, "<i>$1</i>");
                    b = b.replace(/# ([^]+?)\n/g, "**$1**");
                    b = b.replace(/\n\n/g, "\n");

                    b = b.replace("!", "\\!");

                    b = b.replace(/\<bi>([^]*?)\<\/bi>/g, "*_$1_*");
                    b = b.replace(/\<i>([^]*?)\<\/i>/g, "_$1_");
                    b = b.replace(/\<b>([^]*?)\<\/b>/g, "*$1*");

                    body += b + "\n";
                }
            } else {
                body += `${key} 模組未指定輸出報告\n\n`;
            }
        } catch (err) {
            logger.error(err);
        }
    }
    return body;
}

function replace(str) {
    const t = time();
    const rules = [
        [/\$time\$/g, `$year$/$month$/$day$ $hour$:$minute$:$second$`],
        [/\$year\$/g, t[0]],
        [/\$month\$/g, t[1]],
        [/\$day\$/g, t[2]],
        [/\$hour\$/g, t[3]],
        [/\$minute\$/g, t[4]],
        [/\$second\$/g, t[5]],
    ];

    for (let i = 0; i < rules.length; i++) str = str.replace(rules[i][0], rules[i][1]);

    return str;
}

function time() {
    const date = new Date().toLocaleString("en", { timeZone: "Asia/Taipei" }).split(", ");
    let [month, day, year] = date[0].split("/");
    let [hour, minute, second] = date[1].match(/\d{1,2}/g);

    if (+hour === 12 && date[1].toLowerCase().includes("am")) hour = String(+hour - 12);
    if (+hour < 12 && date[1].toLowerCase().includes("pm")) hour = String(+hour + 12);
    return [year, month, day, hour, minute, second];
}
