const fetch = require("node-fetch");

exports.parameters = [
    {
        name: "tg_id",
        required: true,
    },
    {
        name: "tg_ignore",
        required: false,
    },
];

const DEFAULT_CONFIG = {
    title: "執行報告 $time$",
    ignore: ["login", "logout", "report", "telegram"],
};

exports.run = async ({ outputs, params, catchError, log }) => {
    const { tg_id } = params;

    // 合併預設值
    const config = Object.assign(
        {},
        DEFAULT_CONFIG,
        JSON.parse(
            JSON.stringify({
                ignore: params.tg_ignore,
            })
        )
    );
    if (typeof config.ignore === "string") config.ignore = config.ignore.split(",");

    const msg = await message(outputs, config, catchError, log);
    const { ok } = await fetch("https://automia.jacob.workers.dev/", {
        method: "POST",
        body: JSON.stringify({
            id: tg_id,
            send: msg,
        }),
    }).then((r) => r.json());
    if (ok) log("已發送 Telegram 報告！");
    else {
        log(msg);
        catchError("發送 Telegram 報告失敗！");
    }
};

async function message(outputs, config, catchError, log) {
    let body = `*${replace(config.title)}* \n\n`;
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

                    try {
                        b = b.replace(/\starget="[^"]*?"/g, "");
                        b = b.replace(/<a\shref=\"([^"]*)">([^<]*)<\/a>/gim, `[$2]($1)`);
                    } catch (err) {
                        catchError(err);
                    }
                    b = b.replace(/_/g, "\\_");
                    b = b.replace(/\*\*\*([^]+?)\*\*\*/g, "*_$1_*");
                    b = b.replace(/\*([^]+?)\*/g, "_$1_");
                    b = b.replace(/\*\*([^]+?)\*\*/g, "*$1*");
                    b = b.replace(/# ([^]+?)\n/g, "*$1*");
                    b = b.replace(/\n\n/g, "\n");
                    try {
                        b = b.replace(/[^\\]([\~\>\+\-\=\|\{\}\.\!])/g, "\\$1");
                    } catch (err) {
                        catchError(err);
                    }

                    body += b + "\n";
                }
            } else {
                const pairs = JSON.parse(JSON.stringify(output));
                let b = `*${key}*\n`;
                for (let k in pairs) {
                    b += `- ${k}: ${pairs[k]}\n`;
                }
                body += b;
            }
        } catch (err) {
            catchError(err);
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

    if (+hour < 12 && date[1].toLowerCase().includes("pm")) hour = String(+hour + 12);
    return [year, month, day, hour, minute, second];
}
