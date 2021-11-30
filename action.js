"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
prepare();
main();
function prepare() {
    try {
        process.stdout.write("Installing NPM Dependencies... ");
        (0, child_process_1.execSync)("npm install", { cwd: __dirname });
        console.log("Done");
    }
    catch (err) { }
    try {
        process.stdout.write("Installing Playwright Dependencies... ");
        (0, child_process_1.execSync)("npx playwright install", { cwd: __dirname });
        console.log("Done");
    }
    catch (err) { }
    try {
        process.stdout.write("Installing Browser Dependencies... ");
        (0, child_process_1.execSync)("npx playwright install-deps", { cwd: __dirname });
        console.log("Done");
    }
    catch (err) { }
    console.log("\n");
}
async function main() {
    const core = require("@actions/core");
    try {
        const { BahamutAutomation } = require("./lib/core");
        const modules = core.getInput("modules");
        const parameters = { ...JSON.parse(core.getInput("parameters") || "{}") };
        const secrets = { ...JSON.parse(core.getInput("secrets") || "{}") };
        const browser = { type: "webkit", ...JSON.parse(core.getInput("browser") || "{}") };
        const automation = new BahamutAutomation({
            modules: modules.split(",").map((x) => x.trim()),
            params: { ...parameters, ...secrets },
            browser,
        });
        const result = await automation.run();
        if (result) {
            console.log(result);
            process.exit(0);
        }
    }
    catch (error) {
        core.setFailed(error.message);
        process.exit(1);
    }
}
