const { argv, env } = require("process");
const { main } = require("./src/main.js");

[NODE, PROGRAM, USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT] = argv;
env.GITHUB_REPOSITORY = "JacobLinCool/BA";

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
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
