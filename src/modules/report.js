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
    ignore: ["login", "logout"],
};

exports.run = async ({ params, outputs, catchError, log }) => {
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

    const body = await gen_body(outputs, config.ignore, catchError);

    let res = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: replace(config.title),
        body: body,
        labels: config.labels.map((x) => replace(x.trim())),
    });

    return { number: res.data.number };
};

async function gen_body(outputs, ignore, catchError) {
    let body = "";
    for (let key in outputs) {
        if (ignore.includes(key)) continue;
        try {
            const output = outputs[key];
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
    for (let i = 0; i < rules.length; i++) {
        str = str.replace(rules[i][0], rules[i][1]);
    }
    return str;
}

function time() {
    const [date, time] = new Date()
        .toLocaleString("en-GB", { timeZone: "Asia/Taipei" })
        .split(",")
        .map((x) => x.trim());
    const [dy, mt, yr] = date.split("/");
    const [hr, mn, sc] = time.split(":");
    return [yr, mt, dy, hr, mn, sc];
}
