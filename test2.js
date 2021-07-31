const { argv, env } = require("process");
const { main } = require("./src2/main.js");

[NODE, PROGRAM, username, password] = argv;
// 下面這行會決定 Issue Report 會寄到哪裏
env.GITHUB_REPOSITORY = "JacobLinCool/BA";

main({
    config: { headless: false },
    modules: ["login", "ad_handler", "sign", "answer", "lottery", "logout"],
    username,
    password,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
