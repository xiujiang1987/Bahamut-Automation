const { log, err_handler } = require("./utils.js");

async function draw_automation({ page, logger }) {
    let log2 = (msg) => {
        log(msg);
        if (logger) logger(msg);
    };

    log2(`開始執行福利社自動抽抽樂程序`);
    let count = 0;

    log2("正在尋找抽抽樂");
    let draws = [];
    await page.goto("https://fuli.gamer.com.tw/shop.php?page=1");
    let items = await page.$$("a.items-card");
    for (let i = items.length - 1; i >= 0; i--) {
        let is_draw = await items[i].evaluate((node) => node.innerHTML.includes("抽抽樂"));
        if (is_draw) {
            draws.push({
                name: await items[i].evaluate((node) => node.querySelector(".items-title").innerHTML),
                link: await items[i].evaluate((node) => node.href),
            });
        }
    }

    while (await page.$eval("a.pagenow", (node) => (node.nextSibling ? true : false))) {
        await page.goto("https://fuli.gamer.com.tw/shop.php?page=" + (await page.$eval("a.pagenow", (node) => node.nextSibling.innerText)));
        let items = await page.$$("a.items-card");
        for (let i = items.length - 1; i >= 0; i--) {
            let is_draw = await items[i].evaluate((node) => node.innerHTML.includes("抽抽樂"));
            if (is_draw) {
                draws.push({
                    name: await items[i].evaluate((node) => node.querySelector(".items-title").innerHTML),
                    link: await items[i].evaluate((node) => node.href),
                });
            }
        }
    }

    log2(`找到 ${draws.length} 個抽抽樂`);
    draws.forEach(({ name }, i) => {
        log2(`${i + 1}: ${name}`);
    });

    for (let idx = 0; idx < draws.length; idx++) {
        log2(`正在嘗試執行第 ${idx + 1} 個抽抽樂： ${draws[idx].name}`);

        let limitation = 20;
        for (let time = 1; time <= limitation; time++) {
            await page.goto(draws[idx].link).catch(err_handler);
            await page.waitForTimeout(1000);
            let name = await page.$eval("#BH-master > .BH-lbox.fuli-pbox h1", (node) => node.innerHTML);

            if (await page.$(".btn-base.c-accent-o.is-disable")) {
                log2(`第 ${idx + 1} 個抽抽樂（${draws[idx].name}）的廣告免費次數已用完`);
                break;
            }

            log2(`正在執行第 ${time} 次抽獎，可能需要多達 1 分鐘`);

            await page.click(".btn-base.c-accent-o").catch(err_handler);
            await page.waitForTimeout(2000);

            if ((await page.$eval(".dialogify", (node) => node.innerText.includes("勇者問答考驗")).catch(err_handler)) || null) {
                log2(`需要回答問題，正在回答問題`);
                await page.$$eval("#dialogify_1 .dialogify__body a", (options) => {
                    options.forEach((option) => {
                        if (option.dataset.option == option.dataset.answer) option.click();
                    });
                });
                await page.waitForTimeout(2000);
                await page.click("#btn-buy");
            }
            await page.waitForTimeout(4000);

            let ad_status = (await page.$eval(".dialogify .dialogify__body p", (node) => node.innerText).catch(err_handler)) || "";

            if (ad_status.includes("能量不足")) {
                await err_handler(`廣告能量不足？`);
                await page.reload().catch(err_handler);
                continue;
            } else if (ad_status.includes("觀看廣告")) {
                log2(`正在觀看廣告`);
                await page.click("button[type=submit].btn.btn-insert.btn-primary").catch(err_handler);
                await page.waitForTimeout(3000);
                await page.waitForSelector("ins iframe").catch(err_handler);
                const ad_iframe = await page.$("ins iframe").catch(err_handler);
                const ad_frame = await ad_iframe.contentFrame().catch(err_handler);
                await ad_handler(ad_frame);
                await page.waitForTimeout(2000);
            }

            let cost = false; //await page.$eval("#buyD", (node) => !node.innerText.includes("廣告抽獎券"));
            if (!cost) {
                log2(`正在確認結算頁面`);
                await confirm(page).catch(err_handler);
                if ((await page.$(".card > .section > p")) && (await page.$eval(".card > .section > p", (node) => node.innerText.includes("成功")))) {
                    log2("已完成一次抽抽樂：" + name);
                    count++;
                } else {
                    log2("發生錯誤，重試中");
                }
            }
        }
    }

    await page.waitForTimeout(2000);
    log2(`福利社自動抽抽樂程序已完成\n`);

    return { count };
}

async function confirm(page) {
    await page.click("#agree-confirm");
    await page.waitForTimeout(500);
    await page.click("#buyD > div.pbox-btn > a");
    await page.waitForTimeout(800);
    await page.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary");
    await page.waitForNavigation();
    await page.waitForTimeout(1500);
}

async function ad_handler(ad_frame) {
    await ad_frame.waitForTimeout(5000);
    if (await ad_frame.$(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton"))
        await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton").catch(err_handler);

    await ad_frame.waitForTimeout(35000);
    if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
        await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button").catch(err_handler);
    else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon").catch(err_handler);
    else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)"))
        await ad_frame.click("#google-rewarded-video > img:nth-child(4)").catch(err_handler);

    await ad_frame.waitForTimeout(3000);
}

exports.draw_automation = draw_automation;
