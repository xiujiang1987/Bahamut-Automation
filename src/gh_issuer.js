const { Octokit } = require("@octokit/core");
const github = require("@actions/github");

const context = github.context;

let octokit;

class Issuer {
    constructor(data) {
        this.number = data.number;
        this.octokit = octokit;
        this.title = data.title;
        this.tasks = {};

        this.owner = context.repo.owner;
        this.repo = context.repo.repo;

        console.log(`Issuer Set. OWNER: ${this.owner}, REPO: ${this.repo}, ID: ${this.number}`);
    }

    create_task(name) {
        this.tasks[name] = {
            status: "等待中",
            log: "",
        };
    }

    update_task(name, { status, log }) {
        this.tasks[name] = {
            status: status || this.tasks[name].status,
            log: this.tasks[name].log + (log ? log + "\n" : ""),
        };
        this.update();
    }

    async update() {
        await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
            owner: this.owner,
            repo: this.repo,
            issue_number: this.number,
            title: this.title,
            body: this.gen_body(),
        });
    }

    gen_body(end = false) {
        let time = time_info();
        let body = `**${end ? "Finished" : "Updated"}.** (${time[0]}/${time[1]}/${time[2]} ${time[3]}:${time[4]}:${time[5]})\n\n`;
        Object.entries(this.tasks).forEach(([name, task]) => {
            body += `## ${name}: ${task.status} \n\n`;
            body += "```\n" + task.log + "\n```\n\n";
        });
        return body;
    }

    logger(task) {
        return (msg) => {
            let time = time_info();
            this.update_task(task, { log: `[${time[0]}/${time[1]}/${time[2]} ${time[3]}:${time[4]}:${time[5]}] ${msg}` });
        };
    }

    async end() {
        await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
            owner: this.owner,
            repo: this.repo,
            issue_number: this.number,
            title: "[Finished] " + this.title,
            body: this.gen_body(true),
            labels: ["automation", "finished"],
        });
    }
}

async function create_issuer(pat, title = null) {
    octokit = new Octokit({ auth: pat });

    let time = time_info();

    let res = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: title || `Automation (${time[0]}/${time[1]}/${time[2]} ${time[3]}:${time[4]}:${time[5]})`,
        body: `**Created.** (${time[0]}/${time[1]}/${time[2]} ${time[3]}:${time[4]}:${time[5]})\n\n`,
        labels: ["automation", "running"],
    });

    return new Issuer(res.data);
}

function time_info() {
    const [date, time] = new Date()
        .toLocaleString("en-GB", { timeZone: "Asia/Taipei" })
        .split(",")
        .map((x) => x.trim());
    const [dt, mt, yr] = date.split("/");
    const [hr, mn, sc] = time.split(":");
    return [yr, mt, dt, hr, mn, sc];
}

exports.create_issuer = create_issuer;
