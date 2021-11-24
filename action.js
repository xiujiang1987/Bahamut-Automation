const process = require("process");
const core = require("@actions/core");
const automation = require("./src/core");

main();

async function main() {
    try {
        const modules = core.getInput("modules");
        const parameters = JSON.parse(core.getInput("parameters") || "{}");
        const secrets = JSON.parse(core.getInput("secrets") || "{}");
        const browser = JSON.parse(core.getInput("browser") || "{}");

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
