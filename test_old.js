const { argv, env } = require("process");
const { main } = require("./src_old/main.js");

// node test.js 巴哈帳號 巴哈密碼 1 1 1 1 true
// 前四個 1 分別是 自動登入, 雙倍簽到, 抽抽樂, 動畫瘋答題
// 最後的 true 是表示在 Headless 模式執行，改成 false 可以看見瀏覽器行為，方便偵錯
[NODE, PROGRAM, USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT] = argv;
// 下面這行會決定 Issue Report 會寄到哪裏
// env.GITHUB_REPOSITORY = "JacobLinCool/BA";

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
