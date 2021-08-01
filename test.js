const { argv, env } = require("process");
const { main } = require("./src/main.js");

[NODE, PROGRAM, username, password, gh_pat] = argv;
// 下面這行會決定 Issue Report 會發到哪裡，如要使用請改成你的
// env.GITHUB_REPOSITORY = "JacobLinCool/BA";

main({
    config: {
        // 應該成你的電腦上 Google Chrome 的路徑
        path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        // false 可以觀察到每一個步驟
        headless: false,
    },
    modules: ["login", "ad_handler", "sign", "answer", "lottery", "logout", "report"],
    username,
    password,
    gh_pat,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
