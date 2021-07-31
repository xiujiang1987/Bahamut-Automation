exports.parameters = [];

exports.run = async ({ page, outputs, catchError, log }) => {
    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法抽獎");
    if (!outputs.ad_handler) throw new Error("需使用 ad_handler 模組");

    log(`[抽抽樂] 開始執行`);
    let lottery = 0;

    log("[抽抽樂] 正在尋找抽抽樂");
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

    log(`[抽抽樂] 找到 ${draws.length} 個抽抽樂`);
    const unfinished = {};
    draws.forEach(({ name, link }, i) => {
        log(`[抽抽樂] ${i + 1}: ${name}`);
        unfinished[name] = link;
    });

    for (let idx = 0; idx < draws.length; idx++) {
        log(`[抽抽樂] 正在嘗試執行第 ${idx + 1} 個抽抽樂： ${draws[idx].name}`);

        let limitation = 20;
        for (let time = 1; time <= limitation; time++) {
            await page.goto(draws[idx].link).catch(catchError);
            await page.waitForTimeout(1000);
            let name = await page.$eval("#BH-master > .BH-lbox.fuli-pbox h1", (node) => node.innerHTML);

            if (await page.$(".btn-base.c-accent-o.is-disable")) {
                log(`[抽抽樂] 第 ${idx + 1} 個抽抽樂（${draws[idx].name}）的廣告免費次數已用完 ✔`);
                unfinished[draws[idx].name] = undefined;
                break;
            }

            log(`[抽抽樂] 正在執行第 ${time} 次抽獎，可能需要多達 1 分鐘`);

            await page.click(".btn-base.c-accent-o").catch(catchError);
            await page.waitForTimeout(2000);

            if ((await page.$eval(".dialogify", (node) => node.innerText.includes("勇者問答考驗")).catch(() => {})) || null) {
                log(`[抽抽樂] 需要回答問題，正在回答問題`);
                await page.$$eval("#dialogify_1 .dialogify__body a", (options) => {
                    options.forEach((option) => {
                        if (option.dataset.option == option.dataset.answer) option.click();
                    });
                });
                await page.waitForTimeout(2000);
                await page.click("#btn-buy");
            }
            await page.waitForTimeout(2000);

            let ad_status = (await page.$eval(".dialogify .dialogify__body p", (node) => node.innerText).catch(() => {})) || "";

            let ad_frame;
            if (ad_status.includes("能量不足")) {
                await catchError(`廣告能量不足？`);
                await page.reload().catch(catchError);
                continue;
            } else if (ad_status.includes("觀看廣告")) {
                log(`[抽抽樂] 正在觀看廣告`);
                await page.click("button[type=submit].btn.btn-insert.btn-primary").catch(catchError);
                await page.waitForTimeout(1000);
                await page.waitForSelector("ins iframe").catch(catchError);
                const ad_iframe = await page.$("ins iframe").catch(catchError);
                ad_frame = await ad_iframe.contentFrame().catch(catchError);
                await outputs.ad_handler(ad_frame);
                await page.waitForTimeout(2000);
            }

            let url = page.url();
            if (url.includes("/buyD.php") && url.includes("ad=1")) {
                log(`[抽抽樂] 正在確認結算頁面`);
                await confirm(page, catchError).catch(catchError);
                if ((await page.$(".card > .section > p")) && (await page.$eval(".card > .section > p", (node) => node.innerText.includes("成功")))) {
                    log("[抽抽樂] 已完成一次抽抽樂：" + name + " ✔");
                    lottery++;
                } else {
                    log("[抽抽樂] 發生錯誤，重試中 ✘");
                }
            } else {
                console.debug(url);
                console.debug(ad_frame.url());
                log("[抽抽樂] 未進入結算頁面，重試中 ✘");
                catchError(new Error("抽抽樂未進入結算頁面"));
            }
        }
    }

    Object.keys(unfinished).forEach((key) => unfinished[key] === undefined && delete unfinished[key]);

    await page.waitForTimeout(2000);
    log(`[抽抽樂] 執行完畢 ✨\n`);

    return { lottery, unfinished };
};

async function confirm(page, catchError) {
    try {
        await page.click("#agree-confirm");
        await page.waitForTimeout(500);
        await page.click("#buyD > div.pbox-btn > a");
        await page.waitForTimeout(800);
        await page.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary");
        await page.waitForNavigation();
        await page.waitForTimeout(1000);
    } catch (err) {
        console.debug(page.url());
        catchError(err);
    }
}
