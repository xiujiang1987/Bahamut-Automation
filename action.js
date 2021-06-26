import core from "@actions/core";
import github from "@actions/github";
import { main } from "./src/main.js";

(async () => {
    try {
        const USERNAME = core.getInput("username");
        const PASSWORD = core.getInput("password");
        const AUTO_SIGN = core.getInput("auto_sign");
        const AUTO_SIGN_DOUBLE = core.getInput("auto_sign_double");
        const AUTO_DRAW = core.getInput("auto_draw");
        const AUTO_ANSWER_ANIME = core.getInput("auto_answer_anime");

        await main({
            USERNAME,
            PASSWORD,
            AUTO_SIGN,
            AUTO_SIGN_DOUBLE,
            AUTO_DRAW,
            AUTO_ANSWER_ANIME,
        }).catch((error) => core.setFailed(error.message));
    } catch (error) {
        core.setFailed(error.message);
    }
})();
