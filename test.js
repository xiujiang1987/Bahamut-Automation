const { argv, env } = require("process");
const { main } = require("./src/main.js");

// 從 Command Line 拿參數
[NODE, PROGRAM, username, password, twofa, gh_pat, tg_id] = argv;
// 下面這行會決定 Issue Report 會發到哪裡，如要使用請改成你的
// env.GITHUB_REPOSITORY = "JacobLinCool/BA";

// 非機密參數
const parameters = {
    builder: [
        { bsn: "60076", snA: "6515182", content: "$year$/$month$/$day$ 還可以用" },
        { bsn: "60111", snA: "120687", content: "$month$/$day$ 測試" },
    ],
    sayloud: [
        { to: "所有人", text: "$year$/$month$/$day$ OK! https://forum.gamer.com.tw/C.php?bsn=60076&snA=6515182" },
    ],
};

// 機密參數，這裡是從 Command Line 拿，可以改成字串
const secrets = {
    username: username, // username: "jacoblincool",
    password: password, // password: "password",
    twofa: twofa,
    gh_pat: gh_pat,
    tg_id: tg_id,
};

main({
    config: {
        // 應該成你的電腦上 Google Chrome 的路徑
        path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        // false 可以觀察到瀏覽器每一個步驟
        headless: false,
    },
    modules: ["login", "ad_handler", "sign", "guild", "answer", "lottery", "sayloud", "builder", "logout", "report", "telegram"],
    ...parameters,
    ...secrets,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
