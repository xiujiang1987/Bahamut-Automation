const { log, err_handler } = require("./utils.js");

async function draw_automation({ page }) {
    log(`開始執行福利社自動抽抽樂程序`);
    let count = 0;

    log("正在尋找抽抽樂");
    await page.goto("https://fuli.gamer.com.tw/shop.php");
    let items = await page.$$(".type-tag ");
    for (let i = items.length - 1; i >= 0; i--) {
        let is_draw = await items[i].evaluate((node) => node.innerHTML === "抽抽樂");
        if (!is_draw) items.splice(i, 1);
    }
    log(`找到 ${items.length} 個抽抽樂`);

    for (let idx = 0; idx < items.length; idx++) {
        log(`正在嘗試執行第 ${idx + 1} 個抽抽樂`);
        await page.goto("https://fuli.gamer.com.tw/shop.php").catch(err_handler);
        items = await page.$$(".type-tag ");
        for (let i = items.length - 1; i >= 0; i--) {
            let is_draw = await items[i].evaluate((node) => node.innerHTML === "抽抽樂");
            if (!is_draw) items.splice(i, 1);
        }
        items[idx].click().catch(err_handler);
        await page.waitForNavigation().catch(err_handler);

        let limitation = 100;
        while (limitation--) {
            await page.waitForTimeout(2000);

            if (await page.$(".btn-base.c-accent-o.is-disable")) {
                log(`第 ${idx + 1} 個抽抽樂的廣告免費次數已用完`);
                break;
            }

            let name = (await page.title()).replace("勇者福利社 - ", "").replace(" - 巴哈姆特", "");
            log("正在執行：" + name);
            log("可能需要多達 1 分鐘");

            await page.click(".btn-base.c-accent-o").catch(err_handler);
            await page.waitForTimeout(8000);

            if (!(await page.$("button[type=submit].btn.btn-insert.btn-primary"))) {
                await err_handler(`廣告能量不足？`);
                break;
            }

            await page.click("button[type=submit].btn.btn-insert.btn-primary").catch(err_handler);
            await page.waitForTimeout(3000);
            await page.waitForSelector("ins iframe").catch(err_handler);
            const ad_iframe = await page.$("ins iframe").catch(err_handler);
            const ad_frame = await ad_iframe.contentFrame().catch(err_handler);

            await page.waitForTimeout(5000);
            if (await ad_frame.$(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton"))
                await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton").catch(err_handler);

            await page.waitForTimeout(35000);
            if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
                await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button").catch(err_handler);
            else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon").catch(err_handler);
            else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)"))
                await ad_frame.click("#google-rewarded-video > img:nth-child(4)").catch(err_handler);

            await page.waitForTimeout(5000);
            //let cost = await page.$eval("#total-gold", (node) => node.innerHTML !== "廣告抽獎券");
            let cost = false;
            if (!cost) {
                await page.click("#agree-confirm");
                await page.waitForTimeout(500);
                await page.click("#buyD > div.pbox-btn > a");
                await page.waitForTimeout(800);
                await page.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary");
                await page.waitForNavigation().catch(err_handler);
                await page.waitForTimeout(1500);
                await page.click("div.wrapper.wrapper-prompt > div > div > div.form__buttonbar > button");
                await page.waitForTimeout(3000);
                log("已完成一次抽抽樂：" + name);
                count++;
            }
        }
    }

    await page.waitForTimeout(2000);
    log(`福利社自動抽抽樂程序已完成\n`);

    return { count };
}

exports.draw_automation = draw_automation;
