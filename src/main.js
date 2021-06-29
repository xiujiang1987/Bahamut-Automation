const puppeteer = require("puppeteer-core");
const fs = require("fs");
const { log, err_handler } = require("./utils.js");
const { bahamut_login } = require("./login.js");
const { sign_automation } = require("./sign.js");
const { answer_anime_automation } = require("./anser_anime.js");
const { draw_automation } = require("./fuli.js");

let browser, UserAgent;

async function main(args) {
    if (!fs.existsSync("./log/")) fs.mkdirSync("./log/");
    if (!fs.existsSync("./screenshot/")) fs.mkdirSync("./screenshot/");
    log("\n==========");
    log("開始執行巴哈姆特自動化！\n");

    let { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL } = args;

    if (!USERNAME) console.error(`缺少巴哈姆特帳號`);
    if (!PASSWORD) console.error(`缺少巴哈姆特密碼`);

    if (USERNAME && PASSWORD) {
        AUTO_SIGN = AUTO_SIGN == "true" || AUTO_SIGN == "1" || false;
        AUTO_SIGN_DOUBLE = AUTO_SIGN_DOUBLE == "true" || AUTO_SIGN_DOUBLE == "1" || false;
        AUTO_DRAW = AUTO_DRAW == "true" || AUTO_DRAW == "1" || false;
        AUTO_ANSWER_ANIME = AUTO_ANSWER_ANIME == "true" || AUTO_ANSWER_ANIME == "1" || false;
        HEADLESS = !(HEADLESS == "false" || HEADLESS == "0" || false);
        PARALLEL = PARALLEL == "true" || PARALLEL == "1" || false;

        console.log(JSON.stringify({ AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL }, null, 4) + "\n");

        if (AUTO_SIGN || AUTO_DRAW || AUTO_ANSWER_ANIME) {
            browser = await puppeteer.launch({
                executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                userDataDir: "./.data",
                headless: HEADLESS,
                defaultViewport: {
                    width: 1000,
                    height: 800,
                    isMobile: false,
                },
                args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
            });
            UserAgent = (await browser.userAgent()).replace("HeadlessChrome", "Chrome");

            let page = await new_page();
            await bahamut_login({ page, USERNAME, PASSWORD });
            await page.close();
        }

        let parallel_tasks = [];

        if (AUTO_SIGN) {
            let page = await new_page();
            let task = sign_automation({ page, AUTO_SIGN_DOUBLE }).then(() => {
                return page.close();
            });
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
        }

        if (AUTO_ANSWER_ANIME) {
            let page = await new_page();
            let task = answer_anime_automation({ page }).then(() => {
                return page.close();
            });
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
        }

        if (AUTO_DRAW) {
            let page = await new_page();
            let task = draw_automation({ page }).then(() => {
                return page.close();
            });
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
        }

        if (PARALLEL) await Promise.all(parallel_tasks);

        if (browser) await browser.close();
    }

    log("巴哈姆特自動化已執行完畢！感謝您的使用！\n");
}

async function new_page() {
    let page = await browser.newPage();
    await page.setUserAgent(UserAgent);
    return page;
}

exports.main = main;
