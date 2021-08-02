const process = require("process");
const core = require("@actions/core");
// const github = require("@actions/github");
const { main } = require("./src/main.js");

(async () => {
    try {
        const modules = core.getInput("modules");
        const parameters = JSON.parse(core.getInput("parameters") || "");

        await main({
            modules: modules.split(",").map((x) => x.trim()),
            ...parameters,
        })
            .then((msg) => {
                console.log(msg);
                process.exit(0);
            })
            .catch((error) => {
                core.setFailed(error.message);
                process.exit(1);
            });
    } catch (error) {
        core.setFailed(error.message);
    }
})();
