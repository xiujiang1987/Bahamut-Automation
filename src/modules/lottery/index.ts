import countapi from "countapi-js";
import { ElementHandle } from "playwright";
import Pool from "./pool";
import { Module } from "../_module";

const lottery = new Module();

lottery.parameters = [
    {
        name: "lottery_max_attempts",
        required: false,
    },
    {
        name: "lottery_max_parallel",
        required: false,
    },
];

lottery.run = async ({ page, outputs, params, logger }) => {
    const log = (...args: any[]) => logger.log("\u001b[95m[福利社]\u001b[m", ...args);
    const error = (...args: any[]) => logger.error("\u001b[95m[福利社]\u001b[m", ...args);

    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法抽獎");
    if (!outputs.ad_handler) throw new Error("需使用 ad_handler 模組");

    log(`開始執行`);
    let lottery = 0;

    log("正在尋找抽抽樂");
    const draws = await getList({ page, error });

    log(`找到 ${draws.length} 個抽抽樂`);
    const unfinished = {};
    draws.forEach(({ name, link }: any, i: number) => {
        log(`${i + 1}: ${name}`);
        unfinished[name] = link;
    });

    const parrallel = +params.lottery_max_parallel || 1;
    const max_attempts = +params.lottery_max_attempts || 20;

    const context = page.context();

    const pool = new Pool(parrallel);

    for (let i = 0; i < draws.length; i++) {
        pool.push(async () => {
            const idx = i;
            const { link, name } = draws[idx];
            const task_page = await context.newPage();

            for (let attempts = 1; attempts <= max_attempts; attempts++) {
                try {
                    await task_page.goto(link);
                    await task_page.waitForSelector("#BH-master > .BH-lbox.fuli-pbox h1");
                    await task_page.waitForTimeout(100);

                    if (await task_page.$(".btn-base.c-accent-o.is-disable")) {
                        log(`${name} 的廣告免費次數已用完 \u001b[92m✔\u001b[m`);
                        delete unfinished[name];
                        break;
                    }

                    log(`[${idx + 1} / ${draws.length}] (${attempts}) ${name}`);

                    await task_page.click(".btn-base.c-accent-o").catch(error);
                    await task_page.waitForTimeout(3000);

                    if ((await task_page.$eval(".dialogify", (elm: HTMLElement) => elm.innerText.includes("勇者問答考驗")).catch(() => {})) || null) {
                        log(`需要回答問題，正在回答問題`);
                        await task_page.$$eval("#dialogify_1 .dialogify__body a", (options: any[]) => {
                            options.forEach((option: { dataset: { option: any; answer: any }; click: () => void }) => {
                                if (option.dataset.option == option.dataset.answer) option.click();
                            });
                        });
                        await task_page.waitForSelector("#btn-buy");
                        await task_page.waitForTimeout(100);
                        await task_page.click("#btn-buy");
                    }
                    await task_page.waitForTimeout(5000);

                    let ad_status = (await task_page.$eval(".dialogify .dialogify__body p", (elm: HTMLElement) => elm.innerText).catch(() => {})) || "";

                    let ad_frame: any;
                    if (ad_status.includes("廣告能量補充中")) {
                        await error("廣告能量補充中");
                        await task_page.reload().catch(error);
                        continue;
                    } else if (ad_status.includes("觀看廣告")) {
                        log(`正在觀看廣告`);
                        await task_page.click("button[type=submit].btn.btn-insert.btn-primary").catch(error);
                        await task_page.waitForSelector("ins iframe").catch(error);
                        await task_page.waitForTimeout(1000);
                        const ad_iframe = (await task_page.$("ins iframe").catch(error)) as ElementHandle<HTMLIFrameElement>;
                        try {
                            ad_frame = await ad_iframe.contentFrame();
                            await outputs.ad_handler({ ad_frame });
                        } catch (err) {
                            error(err);
                        }
                        await task_page.waitForTimeout(1000);
                    } else {
                        log(ad_status);
                    }

                    const final_url = task_page.url();
                    if (final_url.includes("/buyD.php") && final_url.includes("ad=1")) {
                        log(`正在確認結算頁面`);
                        await checkInfo({ page: task_page, log, error }).catch(error);
                        await confirm({ page: task_page, error }).catch(error);
                        if (
                            (await task_page.$(".card > .section > p")) &&
                            (await task_page.$eval(".card > .section > p", (elm: HTMLElement) => elm.innerText.includes("成功")))
                        ) {
                            log("已完成一次抽抽樂：" + name + " \u001b[92m✔\u001b[m");
                            lottery++;
                        } else {
                            log("發生錯誤，重試中 \u001b[91m✘\u001b[m");
                        }
                    } else {
                        log(final_url);
                        log("未進入結算頁面，重試中 \u001b[91m✘\u001b[m");
                        error("抽抽樂未進入結算頁面");
                    }
                } catch (err) {}
            }
        });
    }

    await pool.go();

    await page.waitForTimeout(2000);
    log(`執行完畢 ✨`);

    if (lottery) countapi.update("Bahamut-Automation", "lottery", lottery);

    return { lottery, unfinished, report };
};

async function getList({ page, error }) {
    let draws: { name: any; link: any }[];

    let attempts = 3;
    while (attempts-- > 0) {
        draws = [];
        try {
            await page.goto("https://fuli.gamer.com.tw/shop.php?page=1");
            let items = await page.$$("a.items-card");
            for (let i = items.length - 1; i >= 0; i--) {
                let is_draw = await items[i].evaluate((node: { innerHTML: string | string[] }) => node.innerHTML.includes("抽抽樂"));
                if (is_draw) {
                    draws.push({
                        name: await items[i].evaluate(
                            (node: { querySelector: (arg0: string) => { (): any; new (): any; innerHTML: any } }) =>
                                node.querySelector(".items-title").innerHTML,
                        ),
                        link: await items[i].evaluate((node: { href: any }) => node.href),
                    });
                }
            }

            while (await page.$eval("a.pagenow", (node: { nextSibling: any }) => (node.nextSibling ? true : false))) {
                await page.goto(
                    "https://fuli.gamer.com.tw/shop.php?page=" +
                        (await page.$eval("a.pagenow", (node: { nextSibling: { innerText: any } }) => node.nextSibling.innerText)),
                );
                let items = await page.$$("a.items-card");
                for (let i = items.length - 1; i >= 0; i--) {
                    let is_draw = await items[i].evaluate((node: { innerHTML: string | string[] }) => node.innerHTML.includes("抽抽樂"));
                    if (is_draw) {
                        draws.push({
                            name: await items[i].evaluate(
                                (node: { querySelector: (arg0: string) => { (): any; new (): any; innerHTML: any } }) =>
                                    node.querySelector(".items-title").innerHTML,
                            ),
                            link: await items[i].evaluate((node: { href: any }) => node.href),
                        });
                    }
                }
            }

            break;
        } catch (err) {
            error(err);
        }
    }

    return draws;
}

async function checkInfo({ page, log, error }) {
    try {
        const name = await page.$eval("#name", (node: { value: any }) => node.value);
        const tel = await page.$eval("#tel", (node: { value: any }) => node.value);
        const city = await page.$eval("[name=city]", (node: { value: any }) => node.value);
        const country = await page.$eval("[name=country]", (node: { value: any }) => node.value);
        const address = await page.$eval("#address", (node: { value: any }) => node.value);

        if (!name) log("無收件人姓名");
        if (!tel) log("無收件人電話");
        if (!city) log("無收件人城市");
        if (!country) log("無收件人區域");
        if (!address) log("無收件人地址");

        if (!name || !tel || !city || !country || !address) throw new Error("警告：收件人資料不全");
    } catch (err) {
        error(err);
    }
}

async function confirm({ page, error }) {
    try {
        await page.click("#agree-confirm");
        await page.waitForSelector("#buyD > div.pbox-btn > a");
        await page.waitForTimeout(100);
        await page.click("#buyD > div.pbox-btn > a");
        await page.waitForSelector("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary");
        await page.waitForTimeout(100);
        await Promise.all([
            page.waitForNavigation(),
            page.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary"),
        ]);
        await page.waitForTimeout(1000);
    } catch (err) {
        error(page.url());
        error(err);
    }
}

function report({ lottery, unfinished }) {
    let body = "# 福利社抽抽樂 \n\n";

    if (lottery) {
        body += `✨✨✨ 獲得 **${lottery}** 個抽獎機會，價值 **${(lottery * 500).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** 巴幣 ✨✨✨\n`;
    }

    if (Object.keys(unfinished).length === 0) {
        body += "🟢 所有抽獎皆已完成\n";
    }
    Object.keys(unfinished).forEach((key) => {
        if (unfinished[key] === undefined) return;
        body += `❌ 未能自動完成所有 ***[${key}](${unfinished[key]})*** 的抽獎\n`;
    });

    body += "\n";
    return body;
}

export default lottery;