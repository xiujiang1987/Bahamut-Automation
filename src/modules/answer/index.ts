import { Module, fetch as node_fetch } from "bahamut-automation";

export default {
    name: "動畫瘋答題",
    description: "自動回答動畫瘋今日問題",
    async run({ page, shared, params, logger }) {
        if (!shared.flags.logged) throw new Error("使用者未登入，無法答題");

        let reward = 0;
        let question: {
            question?: string;
            token?: string;
            a1?: string;
            a2?: string;
            a3?: string;
            a4?: string;
            error?: number;
            msg?: string;
        } = {};
        logger.log(`開始執行`);

        const max_attempts = +params.max_attempts || +shared.max_attempts || 3;
        for (let attempts = 0; attempts < max_attempts; attempts++) {
            try {
                logger.log("正在檢測答題狀態");
                await page.goto("https://ani.gamer.com.tw/");
                await page.waitForTimeout(200);

                question = await page.evaluate(() => {
                    return fetch("/ajax/animeGetQuestion.php?t=" + Date.now()).then((r) =>
                        r.json(),
                    );
                });

                if (question.question) {
                    const options = [null, question.a1, question.a2, question.a3, question.a4];

                    logger.log("尚未回答今日題目，嘗試答題中");
                    logger.info(`今天的問題：${question.question}`);
                    logger.info(`選項：${options.filter(Boolean).join(", ")}`);

                    logger.log(`正在尋找答案`);
                    const token = question.token;
                    const sn = await node_fetch(
                        "https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=blackXblue&page=1",
                    )
                        .then((r) => r.json())
                        .then((d: any) => d.creation[0].sn);
                    const ans = await node_fetch(
                        "https://api.gamer.com.tw/mobile_app/bahamut/v1/home_creation_detail.php?sn=" +
                            sn,
                    )
                        .then((r) => r.json())
                        .then(
                            (d: any) =>
                                d.content
                                    .match(/<body[\s\w"-=]*>([\s\S]*)<\/body>/)[0]
                                    .match(/A[:：](\d)/gi)[0]
                                    .match(/\d/)[0],
                        )
                        .then(parseInt);

                    logger.log(`答案是 ${ans}. ${options[ans]} ！`);
                    logger.log(`正在嘗試回答`);
                    const result = await page.evaluate(
                        async ({ ans, token }) => {
                            const r = await fetch("/ajax/animeAnsQuestion.php", {
                                headers: {
                                    accept: "*/*",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                },
                                method: "POST",
                                body: new URLSearchParams({
                                    token,
                                    ans: ans.toString(),
                                    t: Date.now().toString(),
                                }),
                            });
                            return r.json();
                        },
                        { ans, token },
                    );

                    if (result.error)
                        logger.error("回答問題時發生錯誤 " + result.msg + " \u001b[91m✘\u001b[m");
                    if (result.ok) {
                        logger.success("已回答問題 " + result.gift + " \u001b[92m✔\u001b[m");
                        reward = +result.gift.match(/\d{2,4}/)[0];
                    }
                } else if (
                    question.error === 1 &&
                    question.msg === "今日已經答過題目了，一天僅限一次機會"
                ) {
                    logger.info("今日已經答過題目了 \u001b[92m✔\u001b[m");
                } else {
                    logger.error("發生未知錯誤：" + question.msg + " \u001b[91m✘\u001b[m");
                }

                await page.waitForTimeout(1000);
                break;
            } catch (err) {
                logger.error(err);
                logger.error("發生錯誤，重試中 \u001b[91m✘\u001b[m");
            }
        }
        logger.log(`執行完畢 ✨`);

        const result = { answered: question.error === 1 || !!reward, reward };

        if (shared.report) {
            shared.report.reports.answer = report(result);
        }

        return result;
    },
} as Module;

function report({ reward, answered }: { reward: number; answered: boolean }) {
    let body = "# 動畫瘋答題\n\n";

    if (reward) body += `✨✨✨ 獲得 ${reward} 巴幣 ✨✨✨\n`;
    if (answered) body += `🟢 今日已答題\n`;
    else body += `❌ 今日尚未答題\n`;

    body += "\n";
    return body;
}
