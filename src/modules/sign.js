exports.parameters = [];

exports.run = async ({ page, outputs, catchError, log }) => {
    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法簽到");

    log(`[簽到] 開始執行`);

    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);
    let { days, finishedAd, prjSigninDays, signin } = await sign_status(page);
    log(`[簽到] 已連續簽到天數: ${days}`);

    if (!signin) {
        log("[簽到] 今日尚未簽到 ✘");
        log("[簽到] 正在嘗試簽到");
        await page.click("a#signin-btn").catch(catchError);
        await page.waitForTimeout(5000);
        log("[簽到] 成功簽到 ✔");
    } else {
        log("[簽到] 今日已簽到 ✔");
    }

    if (outputs.ad_handler) {
        let retries = 3;
        while (retries--) {
            try {
                log(`[簽到] 正在檢測雙倍簽到獎勵狀態`);

                await page.goto("https://www.gamer.com.tw/");
                await page.waitForTimeout(1000);
                await page.click("a#signin-btn");
                await page.waitForTimeout(2000);

                if (!finishedAd) {
                    log("[簽到] 尚未獲得雙倍簽到獎勵 ✘");

                    log("[簽到] 嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
                    await page.click("a.popoup-ctrl-btn");
                    await page.waitForTimeout(5000);
                    await page.click("button[type=submit]");

                    await page.waitForTimeout(3000);
                    await page.waitForSelector("ins iframe");
                    const ad_iframe = await page.$("ins iframe");
                    const ad_frame = await ad_iframe.contentFrame();

                    await outputs.ad_handler(ad_frame, log);

                    finishedAd = (await sign_status(page)).finishedAd;

                    if (finishedAd) {
                        log("[簽到] 已觀看雙倍獎勵廣告 ✔");
                        break;
                    } else {
                        throw new Error("觀看雙倍獎勵廣告過程發生未知錯誤");
                    }
                } else {
                    log("[簽到] 已獲得雙倍簽到獎勵 ✔");
                    break;
                }
            } catch (err) {
                catchError(err);
                log(`[簽到] 觀看雙倍獎勵廣告過程發生錯誤，將再重試 ${retries} 次 ✘`);
            }
        }
    } else {
        log("雙倍簽到獎勵需使用 ad_handler 模組");
    }

    const final = await sign_status(page);

    log(`[簽到] 執行完畢 ✨`);

    return {
        days: final.days,
        signed: !!final.signin,
        doubled: !!final.finishedAd,
        report,
    };
};

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
