const puppeteer = require("puppeteer-core");
const fs = require("fs");
const { log, err_handler } = require("./utils.js");
const { bahamut_login, bahamut_logout } = require("./login.js");
const { sign_automation } = require("./sign.js");
const { answer_anime_automation } = require("./anser_anime.js");
const { draw_automation } = require("./fuli.js");
const { create_issuer } = require("./gh_issuer.js");

let browser, UserAgent;

async function main(args) {
    if (!fs.existsSync("./log/")) fs.mkdirSync("./log/");
    if (!fs.existsSync("./screenshot/")) fs.mkdirSync("./screenshot/");
    log("\n==========");
    log("開始執行巴哈姆特自動化！\n");
    let { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT } = args;

    if (!USERNAME) console.error(`缺少巴哈姆特帳號`);
    if (!PASSWORD) console.error(`缺少巴哈姆特密碼`);

    if (USERNAME && PASSWORD) {
        // 參數標準化
        AUTO_SIGN = AUTO_SIGN == "true" || AUTO_SIGN == "1" || false;
        AUTO_SIGN_DOUBLE = AUTO_SIGN_DOUBLE == "true" || AUTO_SIGN_DOUBLE == "1" || false;
        AUTO_DRAW = AUTO_DRAW == "true" || AUTO_DRAW == "1" || false;
        AUTO_ANSWER_ANIME = AUTO_ANSWER_ANIME == "true" || AUTO_ANSWER_ANIME == "1" || false;
        HEADLESS = !(HEADLESS == "false" || HEADLESS == "0" || false);
        PARALLEL = PARALLEL == "true" || PARALLEL == "1" || false;
        GH_PAT = GH_PAT || "";

        console.log(JSON.stringify({ AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT }, null, 4) + "\n");

        let issuer = null;
        if (GH_PAT) {
            issuer = await create_issuer(GH_PAT);
            issuer.create_task("登入");
            issuer.create_task("簽到");
            issuer.create_task("答題");
            issuer.create_task("抽獎");
            issuer.update();
        }

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

            if (GH_PAT) issuer.update_task("登入", { status: "執行中" });
            let page = await new_page();
            await bahamut_login({ page, USERNAME, PASSWORD, logger: GH_PAT ? issuer.logger("登入") : null });
            await page.close();
            if (GH_PAT) issuer.update_task("登入", { status: "完成" });
        }

        let parallel_tasks = [];

        if (AUTO_SIGN) {
            if (GH_PAT) issuer.update_task("簽到", { status: "執行中" });
            let page = await new_page();
            let task = timeout(
                async () => {
                    await sign_automation({ page, AUTO_SIGN_DOUBLE, logger: GH_PAT ? issuer.logger("簽到") : null });
                    await page.close();
                },
                10 * 60 * 1000,
                "Sign"
            );
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
            if (GH_PAT) issuer.update_task("簽到", { status: "完成" });
        }

        if (AUTO_ANSWER_ANIME) {
            if (GH_PAT) issuer.update_task("答題", { status: "執行中" });
            let page = await new_page();
            let task = timeout(
                async () => {
                    await answer_anime_automation({ page, logger: GH_PAT ? issuer.logger("答題") : null });
                    await page.close();
                },
                10 * 60 * 1000,
                "Answer"
            );
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
            if (GH_PAT) issuer.update_task("答題", { status: "完成" });
        }

        if (AUTO_DRAW) {
            if (GH_PAT) issuer.update_task("抽獎", { status: "執行中" });
            let page = await new_page();
            let task = timeout(
                async () => {
                    await draw_automation({ page, logger: GH_PAT ? issuer.logger("抽獎") : null });
                    await page.close();
                },
                2 * 60 * 60 * 1000,
                "Draw"
            );
            if (PARALLEL) parallel_tasks.push(task);
            else await task;
            if (GH_PAT) issuer.update_task("抽獎", { status: "完成" });
        }

        if (PARALLEL) await Promise.all(parallel_tasks);

        if (browser) {
            // 登出帳號
            let page = await new_page();
            await bahamut_logout({ page, logger: GH_PAT ? issuer.logger("登入") : null });
            await page.close();

            await browser.close();
        }

        if (GH_PAT) await issuer.end();
    }

    log("巴哈姆特自動化已執行完畢！感謝您的使用！\n");
    return true;
}

async function new_page() {
    let page = await browser.newPage();
    await page.setUserAgent(UserAgent);
    return page;
}

function timeout(func, time = 2 * 60 * 60 * 1000, name = "") {
    return new Promise((r) => {
        setTimeout(() => {
            log("[Timed Out] " + name);
            r();
        }, time);
        func().then(r);
    });
}

exports.main = main;
