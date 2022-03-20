import github from "@actions/github";
import { Context } from "@actions/github/lib/context";
import { Octokit } from "@octokit/core";
import Module from "../_module";
import { template } from "../utils";

let octokit: Octokit, context: Context;
const DEFAULT_LABELS = ["自動化報告"] as const;

export default {
    name: "GitHub Issue 通知",
    description: "發送 GitHub Issue 通知",
    async run({ shared, params, logger }) {
        if (!shared.report) {
            logger.error("請設定 report 模組");
            return;
        }

        if (!params.pat) {
            logger.error("請設定 GitHub Personal Access Token (pat)");
            return;
        }

        if ((await shared.report.text()).length == 0) {
            logger.log("沒有報告內容");
            return;
        }

        const labels = [...DEFAULT_LABELS, ...params.labels];

        // 設定 Octokit 及獲取 GitHub 資料
        octokit = new Octokit({ auth: params.gh_pat });
        context = github.context;

        if (shared.issue && shared.issue.number) {
            await updateIssue(shared.issue.number, shared.report).then(() => {
                logger.log("Report Updated.");
            });
            return shared.issue;
        } else {
            const res = await createIssue(shared.report, labels);
            if (res && res.data && res.data.number)
                logger.log(
                    `Report: https://github.com/${context.repo.owner}/${context.repo.repo}/issues/${res.data.number}`,
                );

            return { number: res.data.number };
        }
    },
} as Module;

async function createIssue(
    report: { title: string; markdown: () => Promise<string> },
    labels: string[],
) {
    return await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: report.title,
        body: await report.markdown(),
        labels: labels.map((x) => template(x.trim())),
    });
}

async function updateIssue(
    number: number,
    report: { title: string; markdown: () => Promise<string> },
) {
    return await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: number,
        body: await report.markdown(),
    });
}
