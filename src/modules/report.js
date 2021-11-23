const { Octokit } = require("@octokit/core");
const github = require("@actions/github");

exports.parameters = [
    {
        name: "gh_pat",
        required: true,
    },
    {
        name: "report_title",
        required: false,
    },
    {
        name: "report_labels",
        required: false,
    },
    {
        name: "report_ignore",
        required: false,
    },
];

const DEFAULT_CONFIG = {
    title: "執行報告 $time$",
    labels: ["自動化報告"],
    ignore: ["login", "logout", "report"],
};

exports.run = async ({ params, outputs, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[報告]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[報告]\u001b[m", ...args);

    // 設定 Octokit 及獲取 GitHub 資料
    const GH_PAT = params.gh_pat;
    const octokit = new Octokit({ auth: GH_PAT });
    const context = github.context;

    // 合併預設值
    const config = Object.assign(
        {},
        DEFAULT_CONFIG,
        JSON.parse(
            JSON.stringify({
                title: params.report_title,
                labels: params.report_labels,
                ignore: params.report_ignore,
            })
        )
    );
    if (typeof config.labels === "string") config.labels = config.labels.split(",");
    if (typeof config.ignore === "string") config.ignore = config.ignore.split(",");

    if (outputs.report && outputs.report.number) {
        await updateIssue({ number: outputs.report.number, octokit, context, config, outputs, error, log }).then(() => {
            log("Report Updated.");
        });
        return outputs.report;
    } else {
        let res = await createIssue({ octokit, context, config, outputs, error, log });
        if (res && res.data && res.data.number) log(`Report: https://github.com/${context.repo.owner}/${context.repo.repo}/issues/${res.data.number}`);

        return { number: res.data.number };
    }
};

async function createIssue({ octokit, context, config, outputs, error, log }) {
    const body = await gen_body(outputs, config.ignore, error, log);

    let res = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: replace(config.title),
        body: body,
        labels: config.labels.map((x) => replace(x.trim())),
    });

    return res;
}

async function updateIssue({ number, octokit, context, config, outputs, error, log }) {
    const body = await gen_body(outputs, config.ignore, error, log);

    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: number,
        body: body,
    });
}

async function gen_body(outputs, ignore, error, log) {
    let body = "";
    for (let key in outputs) {
        if (ignore.includes(key)) continue;
        try {
            if (typeof outputs[key] === "function") continue;
            const output = outputs[key];
            if (!output) continue;

            if (output.report) {
                if (typeof output.report === "string") {
                    body += `${output.report}\n\n`;
                } else if (typeof output.report === "function") {
                    body += (await output.report(JSON.parse(JSON.stringify(output)))) + "\n\n";
                }
            } else {
                const pairs = JSON.parse(JSON.stringify(output));
                let b = `# ${key}\n\n`;
                for (let k in pairs) {
                    b += `- ${k}: ${pairs[k]}\n\n`;
                }
                body += b;
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
