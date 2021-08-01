const { argv, env } = require("process");
const { main } = require("./src/main.js");

[NODE, PROGRAM, username, password, gh_pat] = argv;
// 下面這行會決定 Issue Report 會寄到哪裏
env.GITHUB_REPOSITORY = "JacobLinCool/BA";

main({
    config: { headless: true },
    modules: ["login", "ad_handler", "sign", "answer", "lottery", "logout", "report"],
    username,
    password,
    gh_pat,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
