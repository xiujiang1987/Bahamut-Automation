import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

prepare();
main();

function prepare(): void {
    try {
        process.stdout.write("Installing PNPM... ");
        execSync("npm i -g pnpm", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}
    try {
        process.stdout.write("Installing Packages... ");
        execSync("pnpm i", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}
    try {
        process.stdout.write("Installing Playwright Dependencies... ");
        execSync("pnpx -y playwright install", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}
    try {
        process.stdout.write("Installing Browser Dependencies... ");
        execSync("pnpx -y playwright install-deps", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}

    console.log("\n");
}

async function main(): Promise<void> {
    const core = (await import("@actions/core")).default;
    try {
        const config_path = path.resolve(core.getInput("config"));
        const secrets: Record<string, string> = { ...JSON.parse(core.getInput("secrets") || "{}") };

        let raw = fs.readFileSync(config_path, "utf8");
        for (const key in secrets) {
            const regex = new RegExp("\\$" + key, "g");
            console.log(`Replacing ${raw.match(regex)?.length ?? 0} ${regex} in ${config_path}`);
            raw = raw.replace(regex, secrets[key]);
        }
        fs.writeFileSync(config_path, raw);

        // @ts-ignore
        const { BahamutAutomation } = await import("./lib/core/index.js");

        const automation = BahamutAutomation.from(config_path);
        automation.setup_listeners();
        const result = await automation.run();

        if (result) {
            console.log(result);
            process.exit(0);
        }
    } catch (error) {
        core.setFailed(error.message);
        process.exit(1);
    }
}
