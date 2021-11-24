const countapi = require("countapi-js");

exports.parameters = [
    {
        name: "sign_double_max_attempts",
        required: false,
    },
];

exports.run = async ({ page, outputs, params, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[簽到]\u001b[m", ...args);
    const warn = (...args) => logger.warn("\u001b[95m[簽到]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[簽到]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法簽到");

    log(`開始執行`);

    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);
    let { days, finishedAd, signin } = await sign_status(page);
    const initialSignin = signin;
    log(`已連續簽到天數: ${days}`);

    if (!signin) {
        log("今日尚未簽到 \u001b[91m✘\u001b[m");
        log("正在嘗試簽到");
        await page.click("a#signin-btn").catch(error);
        await page.waitForTimeout(5000);
        log("成功簽到 \u001b[92m✔\u001b[m");
    } else {
        log("今日已簽到 \u001b[92m✔\u001b[m");
    }

    if (outputs.ad_handler) {
        const max_attempts = +params.sign_double_max_attempts || 3;
        for (let attempts = 0; attempts < max_attempts; attempts++) {
            try {
                log(`正在檢測雙倍簽到獎勵狀態`);

                await page.goto("https://www.gamer.com.tw/");
                await page.waitForSelector("a#signin-btn");
                await page.waitForTimeout(100);
                await page.click("a#signin-btn");
                await page.waitForSelector("a.popoup-ctrl-btn");
                await page.waitForTimeout(100);

                if (!finishedAd) {
                    log("尚未獲得雙倍簽到獎勵 ✘");

                    log("嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
                    await page.click("a.popoup-ctrl-btn");
                    await page.waitForSelector("button[type=submit]");
                    await page.waitForTimeout(100);
                    await page.click("button[type=submit]");

                    await page.waitForTimeout(3000);
                    await page.waitForSelector("ins iframe");
                    const ad_iframe = await page.$("ins iframe");
                    const ad_frame = await ad_iframe.contentFrame();

                    await outputs.ad_handler({ ad_frame });

                    finishedAd = (await sign_status(page)).finishedAd;

                    if (finishedAd) {
                        log("已觀看雙倍獎勵廣告 \u001b[92m✔\u001b[m");
                        break;
                    }
                    throw new Error("觀看雙倍獎勵廣告過程發生未知錯誤");
                } else {
                    log("已獲得雙倍簽到獎勵 \u001b[92m✔\u001b[m");
                    break;
                }
            } catch (err) {
                error(err);
                error(`觀看雙倍獎勵廣告過程發生錯誤，將再重試 ${retries} 次 \u001b[91m✘\u001b[m`);
            }
        }
    } else {
        warn("雙倍簽到獎勵需使用 ad_handler 模組");
    }

    const final = await sign_status(page);

    log(`執行完畢 ✨`);

    if (!initialSignin && final.signin) countapi.update("Bahamut-Automation", "sign", 1);

    return {
        signed: !!final.signin,
        doubled: !!final.finishedAd,
        days: final.days,
        report,
    };
};

async function sign_status(page) {
    const { data } = await page.evaluate(() => {
        const controller = new AbortController();

        setTimeout(() => controller.abort(), 30000);

        return fetch("https://www.gamer.com.tw/ajax/signin.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=2",
            signal: controller.signal,
        }).then((r) => r.json());
    });

    return data;
}

function report({ days, signed, doubled }) {
    let body = `# 簽到\n\n`;

    body += `✨✨✨ 已連續簽到 ${days} 天 ✨✨✨\n`;
    if (signed) body += `🟢 今日已簽到\n`;
    else body += `❌ 今日尚未簽到\n`;
    if (doubled) body += `🟢 已獲得雙倍簽到獎勵\n`;
    else body += `❌ 尚未獲得雙倍簽到獎勵\n`;

    body += "\n";
    return body;
}
