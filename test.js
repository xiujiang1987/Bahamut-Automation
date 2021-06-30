const { argv } = require("process");
const { main } = require("./src/main.js");

[NODE, PROGRAM, USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT] = argv;

main({
    USERNAME,
    PASSWORD,
    AUTO_SIGN,
    AUTO_SIGN_DOUBLE,
    AUTO_DRAW,
    AUTO_ANSWER_ANIME,
    HEADLESS,
    PARALLEL,
    GH_PAT,
});
