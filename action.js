const process = require("process");
const core = require("@actions/core");
// const github = require("@actions/github");
const { main } = require("./src/main.js");

(async () => {
    try {
        const username = core.getInput("username");
        const password = core.getInput("password");
        const AUTO_SIGN = core.getInput("auto_sign");
        const AUTO_DRAW = core.getInput("auto_draw");
        const AUTO_ANSWER_ANIME = core.getInput("auto_answer_anime");
        const GH_PAT = core.getInput("gh_pat");

        const modules = ["login"];
        if (AUTO_SIGN || AUTO_DRAW) modules.push("ad_handler");
        if (AUTO_SIGN) modules.push("sign");
        if (AUTO_ANSWER_ANIME) modules.push("answer");
        if (AUTO_DRAW) modules.push("lottery");
        modules.push("logout");
        if (GH_PAT) modules.push("report");

        await main({ modules, username, password, gh_pat: GH_PAT || undefined })
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
