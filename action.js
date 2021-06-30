const process = require("process");
const core = require("@actions/core");
// const github = require("@actions/github");
const { main } = require("./src/main.js");

(async () => {
    try {
        const USERNAME = core.getInput("username");
        const PASSWORD = core.getInput("password");
        const AUTO_SIGN = core.getInput("auto_sign");
        const AUTO_SIGN_DOUBLE = core.getInput("auto_sign_double");
        const AUTO_DRAW = core.getInput("auto_draw");
        const AUTO_ANSWER_ANIME = core.getInput("auto_answer_anime");
        const PARALLEL = core.getInput("parallel");
        const GH_PAT = core.getInput("gh_pat");

        await main({
            USERNAME,
            PASSWORD,
            AUTO_SIGN,
            AUTO_SIGN_DOUBLE,
            AUTO_DRAW,
            AUTO_ANSWER_ANIME,
            PARALLEL,
            GH_PAT,
        })
            .then(console.log)
            .catch((error) => {
                core.setFailed(error.message);
                process.exit(1);
            });
    } catch (error) {
        core.setFailed(error.message);
    }
})();
