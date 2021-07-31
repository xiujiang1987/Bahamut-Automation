const { log, err_handler } = require("./utils.js");
const { ad_handler } = require("./ad.js");

async function sign_automation({ page, AUTO_SIGN_DOUBLE, logger }) {
    let log2 = (msg) => {
        log(msg);
        if (logger) logger(msg);
    };

    log2(`[簽到] 開始執行`);

    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);
    let { days, finishedAd, prjSigninDays, signin } = await sign_status(page);
    log2(`[簽到] 已連續簽到天數: ${days}`);

    if (!signin) {
        log2("[簽到] 今日尚未簽到 ✘");
        log2("[簽到] 正在嘗試簽到");
        await page.click("a#signin-btn").catch(err_handler);
        await page.waitForTimeout(5000);
        log2("[簽到] 成功簽到 ✔");
    } else {
        log2("[簽到] 今日已簽到 ✔");
    }

    if (AUTO_SIGN_DOUBLE) {
        let retries = 3;
        while (retries--) {
            log2(`[簽到] 正在檢測雙倍簽到獎勵狀態`);

            await page.goto("https://www.gamer.com.tw/").catch(err_handler);
            await page.waitForTimeout(1000);
            await page.click("a#signin-btn").catch(err_handler);
            await page.waitForTimeout(2000);

            if (!finishedAd) {
                log2("[簽到] 尚未獲得雙倍簽到獎勵 ✘");

                log2("[簽到] 嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
                await page.click("a.popoup-ctrl-btn").catch(err_handler);
                await page.waitForTimeout(5000);
                await page.click("button[type=submit]").catch(err_handler);

                await page.waitForTimeout(3000);
                await page.waitForSelector("ins iframe").catch(err_handler);
                const ad_iframe = await page.$("ins iframe").catch(err_handler);
                const ad_frame = await ad_iframe.contentFrame().catch(err_handler);

                await ad_handler(ad_frame).catch(err_handler);

                finishedAd = (await sign_status(page)).finishedAd;

                if (finishedAd) {
                    log2("[簽到] 已觀看雙倍獎勵廣告 ✔");
                    break;
                }

                log2(`[簽到] 觀看雙倍獎勵廣告過程發生錯誤，將再重試 ${retries} 次 ✘`);
            } else {
                log2("[簽到] 已獲得雙倍簽到獎勵 ✔");
                break;
            }
        }
    }

    const final = await sign_status(page);

    log2(`[簽到] 執行完畢 ✨\n`);

    return {
        days: final.days,
        signed: !!final.signin,
        doubled: !!final.finishedAd,
    };
}

async function sign_status(page) {
    let { data } = await page.evaluate(() => {
        return fetch("https://www.gamer.com.tw/ajax/signin.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=2",
        }).then((r) => r.json());
    });

    return data;
}

exports.sign_automation = sign_automation;
