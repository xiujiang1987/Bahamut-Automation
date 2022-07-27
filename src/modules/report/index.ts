import { Module, utils } from "bahamut-automation";
import { convert as html_to_text } from "html-to-text";
import markdownIt from "markdown-it";
import TurndownService from "turndown";

const { template } = utils;

const md = markdownIt();
const td = new TurndownService({ headingStyle: "atx" });

type Config = {
    title: string;
    ignore: string | string[];
    only_failed: boolean;
};

const DEFAULT_CONFIG: Config = {
    title: "巴哈自動化！ 報告 $time$",
    ignore: ["login", "logout", "report"],
    only_failed: false,
};

export default {
    name: "Report",
    description: "報告",
    async run({ params, shared, logger }) {
        const config: Config = Object.assign(
            {},
            DEFAULT_CONFIG,
            JSON.parse(JSON.stringify(params)),
        );
        if (typeof config.ignore === "string") config.ignore = config.ignore.split(",");

        logger.log("DONE");

        const reports = {};

        return {
            title: template(config.title),
            reports,
            text: () => text(reports, config),
            markdown: () => markdown(reports, config),
            html: () => html(reports, config),
        };
    },
} as Module;

async function text(reports: any, config: Config) {
    const { html } = await normalize(reports, config);
    const text = html_to_text(html).replace(/\n\n\n+/g, "\n\n");
    return config.only_failed && !text.includes("❌") ? "" : text;
}

async function markdown(reports: any, config: Config) {
    const { markdown } = await normalize(reports, config);
    return config.only_failed && !markdown.includes("❌") ? "" : markdown;
}

async function html(reports: any, config: Config) {
    const { html } = await normalize(reports, config);
    return config.only_failed && !html.includes("❌") ? "" : html;
}

async function normalize(reports: any, config: Config) {
    let report = "";

    report += `# ${config.title}\n\n`;

    for (const module in reports) {
        // ignored
        if (config.ignore.includes(module)) continue;
        // no output
        if (!reports[module]) continue;

        report += `## ${module}\n`;

        const module_report = reports[module];

        if (typeof module_report === "string") {
            report += module_report + "\n";
        } else if (typeof module_report === "function") {
            report += (await module_report()) + "\n";
        }
    }

    const raw_md = template(report);

    const html = md.render(raw_md, {
        html: true,
        linkify: true,
        typographer: true,
    });

    const markdown = td.turndown(html);

    return { html, markdown };
}
