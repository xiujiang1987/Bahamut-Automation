const { log, err_handler } = require("./utils.js");

async function sign_automation({ page, AUTO_SIGN_DOUBLE, logger }) {
    let log2 = (msg) => {
        log(msg);
        if (logger) logger(msg);
    };

    log2(`開始執行自動簽到程序`);

    log2("正在檢測簽到狀態");
    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);
    let signed = await page.$eval("a#signin-btn", (node) => node.innerText.includes("每日簽到已達成")).catch(err_handler);
    if (!signed) {
        log2("簽到狀態: 尚未簽到");
        log2("正在嘗試簽到");
        await page.click("a#signin-btn").catch(err_handler);
        await page.waitForTimeout(5000);
        await page.screenshot({ path: `./screenshot/${Date.now()}.jpg`, type: "jpeg" });
        log2("成功簽到！");
    } else {
        log2("簽到狀態: 已簽到");
    }

    await page.waitForTimeout(1000);
    log2(`自動簽到程序已完成\n`);

    if (AUTO_SIGN_DOUBLE) {
        log2(`開始執行自動觀看雙倍簽到獎勵廣告程序`);

        let retries = 3;
        while (retries--) {
            log2("正在檢測雙倍簽到獎勵狀態");

            await page.goto("https://www.gamer.com.tw/").catch(err_handler);
            log("Reload Passed.");
            await page.waitForTimeout(1000);
            await page.click("a#signin-btn").catch(err_handler);
            log("Sign Button Clicked.");
            await page.waitForTimeout(2000);

            let reward_doubled = await page.$("a.popoup-ctrl-btn.is-disable");
            if (!reward_doubled) {
                log2("雙倍簽到獎勵狀態: 尚未獲得雙倍簽到獎勵");

                log2("嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
                await page.click("a.popoup-ctrl-btn").catch(err_handler);
                await page.waitForTimeout(5000);
                await page.click("button[type=submit]").catch(err_handler);

                await page.waitForTimeout(3000);
                await page.waitForSelector("ins iframe").catch(err_handler);
                const ad_iframe = await page.$("ins iframe").catch(err_handler);
                const ad_frame = await ad_iframe.contentFrame().catch(err_handler);

                await ad_handler(ad_frame).catch(err_handler);

                if (await page.$("a.popoup-ctrl-btn.is-disable")) {
                    log2("已觀看雙倍獎勵廣告");
                    break;
                }

                log2(`觀看雙倍獎勵廣告過程發生錯誤，將再重試 ${retries} 次`);
            } else {
                log2("雙倍簽到獎勵狀態: 已獲得雙倍簽到獎勵");
                break;
            }
        }

        log2(`自動觀看雙倍簽到獎勵廣告程序已完成\n`);
    }
}

async function ad_handler(ad_frame) {
    await ad_frame.waitForTimeout(2000);
    if (await ad_frame.$(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton"))
        await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton").catch(err_handler);

    await Promise.race([
        ad_frame.waitForSelector(".videoAdUiSkipContainer.html5-stop-propagation > button", { visible: true, timeout: 35000 }),
        ad_frame.waitForSelector("div#close_button_icon", { visible: true, timeout: 35000 }),
        // ad_frame.waitForSelector("#google-rewarded-video > img:nth-child(4)", { visible: true, timeout: 35000 }),
    ]).catch(() => {});
    await ad_frame.waitForTimeout(1000);

    if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
        await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button").catch(err_handler);
    else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon").catch(err_handler);
    else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)"))
        await ad_frame.click("#google-rewarded-video > img:nth-child(4)").catch(err_handler);
    else {
        const ad_frame_content = await ad_frame.evaluate(() => document.body.innerHTML).catch(() => null);
        console.debug(ad_frame_content);
        err_handler("發現未知類型的廣告");
    }

    await ad_frame.waitForTimeout(2000);
}

exports.sign_automation = sign_automation;
