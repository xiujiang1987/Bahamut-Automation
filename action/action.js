const process = require("process");
const { execSync } = require("child_process");

main();

async function main() {
    try {
        console.log("Installing NPM Dependencies...");
        execSync("npm install", { stdio: "inherit", cwd: __dirname });
        console.log("Dependencies NPM Installed");
    } catch (err) {}
    try {
        console.log("Installing Playwright Dependencies...");
        execSync("npx playwright install", { stdio: "inherit", cwd: __dirname });
        console.log("Playwright Dependencies Installed");
    } catch (err) {}
    try {
        console.log("Installing Browser Dependencies...");
        execSync("npx playwright install-dep", { stdio: "inherit", cwd: __dirname });
        console.log("Browser Dependencies Installed");
    } catch (err) {}

    try {
        const core = require("@actions/core");
        const automation = require("./src/core");

        const modules = core.getInput("modules");
        const parameters = JSON.parse(core.getInput("parameters") || "{}");
        const secrets = JSON.parse(core.getInput("secrets") || "{}");
        const browser = JSON.parse(core.getInput("browser") || `{ "type": "webkit" }`); // issue #32 workaround

        const result = await automation({
            modules: modules.split(",").map((x) => x.trim()),
            params: { ...parameters, ...secrets },
            browser,
        });

        if (result) {
            console.log(result);
            process.exit(0);
        }
    } catch (error) {
        core.setFailed(error.message);
        process.exit(1);
    }
}
