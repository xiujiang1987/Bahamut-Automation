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

        console.log(`Issuer Set. OWNER: ${this.owner}, REPO: ${this.repo}, ID: ${this.id}`);
    }

    task(name, status) {
        this.tasks[name] = status;
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

    gen_body() {
        let body = `**Updated. (${new Date()})**\n\n`;
        Object.entries(this.tasks).forEach(([key, val]) => {
            body += `## ${key}: ${val} \n\n`;
        });
    }
}

async function create_issuer(pat, title = null) {
    octokit = new Octokit({ auth: pat });

    let res = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: title || "Automation " + new Date(),
        body: `**Created. (${new Date()})**\n\n`,
    });

    return new Issuer(res.data);
}

exports.create_issuer = create_issuer;
