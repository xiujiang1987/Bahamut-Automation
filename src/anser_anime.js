const fetch = require("node-fetch");
const { log, err_handler } = require("./utils.js");

async function answer_anime_automation({ browser }) {
    log(`開始執行動畫瘋自動答題程序`);

    log("正在檢測答題狀態");
    let page = await browser.newPage();
    await page.goto("https://ani.gamer.com.tw/");
    await page.waitForTimeout(500);

    let question = await page.evaluate(() => {
        return fetch("/ajax/animeGetQuestion.php?t=" + Date.now()).then((r) => r.json());
    });

    if (question.question) {
        log("尚未回答今日題目，嘗試答題中");
        log(`今天的問題：${question.question}`);
        log(`選項：${[question.a1, question.a2, question.a3, question.a4].join(", ")}`);

        log(`正在尋找答案`);
        let token = question.token;
        let sn = await fetch("https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=blackXblue&page=1")
            .then((r) => r.json())
            .then((d) => d.creation[0].sn);
        let ans = await fetch("https://api.gamer.com.tw/mobile_app/bahamut/v1/home_creation_detail.php?sn=" + sn)
            .then((r) => r.json())
            .then(
                (d) =>
                    d.content
                        .match(/<body[\s\w"-=]*>([\s\S]*)<\/body>/)[0]
                        .match(/A[:：](\d)/gi)[0]
                        .match(/\d/)[0]
            )
            .then(parseInt);

        log(`正在嘗試回答`);
        let result = await page.evaluate(
            (ans, token) => {
                return fetch("/ajax/animeAnsQuestion.php", {
                    headers: {
                        accept: "*/*",
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                    },
                    method: "POST",
                    body: encodeURI(`token=${token}&ans=${ans}&t=${Date.now()}`),
                }).then((r) => r.json());
            },
            ans,
            token
        );

        if (result.error) log("回答問題時發生錯誤 " + result.msg);
        if (result.ok) log("已回答問題 " + result.gift);
    } else if (question.error === 1 && question.msg === "今日已經答過題目了，一天僅限一次機會") {
        log("今日已經答過題目了");
    } else {
        log("發生未知錯誤：" + question.msg);
    }

    await page.waitForTimeout(1000);
    await page.close();
    log(`動畫瘋自動答題程序已完成\n`);
}

exports.answer_anime_automation = answer_anime_automation;
