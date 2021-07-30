const puppeteer = require("puppeteer-core");
const fs = require("fs");
const { log, err_handler, sleep } = require("./utils.js");
const { bahamut_login, bahamut_logout } = require("./login.js");
const { sign_automation } = require("./sign.js");
const { answer_anime_automation } = require("./anser_anime.js");
const { draw_automation } = require("./fuli.js");
const { create_issuer } = require("./gh_issuer.js");
const { sentryInit, finishTransaction } = require("./sentry.js");

let browser, UserAgent;

async function main(args) {
    if (!fs.existsSync("./log/")) fs.mkdirSync("./log/");
    if (!fs.existsSync("./screenshot/")) fs.mkdirSync("./screenshot/");

    log("\n==========");
    log("開始執行巴哈姆特自動化！\n");
    const { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT } = await param_parser(args);

    if (USERNAME && PASSWORD) {
        console.log(JSON.stringify({ AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT }, null, 4) + "\n");

        // Initialize Sentry
        sentryInit();

        // issuer 是用來發 GitHub Issue Report 的，範例請至 https://github.com/JacobLinCool/BA/issues 查看
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
                // 使用 Chrome ， Chromium 沒有支援 mp4 格式，不同作業系統請自行更改 Chrome 位置
                executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                // 把 userDataDir 移除將不會儲存瀏覽器的紀錄，每次皆會重新登入
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
            await bahamut_login({ page, USERNAME, PASSWORD, logger: GH_PAT ? issuer.logger("登入") : null }).catch(err_handler);
            await page.close();
            if (GH_PAT) issuer.update_task("登入", { status: "完成" });
        }

        // 平行處理用的，非常不穩定！
        let parallel_tasks = [];

        if (AUTO_SIGN) {
            if (GH_PAT) issuer.update_task("簽到", { status: "執行中" });
            let page = await new_page();
            let task = Promise.race([
                sign_automation({ page, AUTO_SIGN_DOUBLE, logger: GH_PAT ? issuer.logger("簽到") : null }).catch(err_handler),
                sleep(10 * 60 * 1000, "[Timed Out] 簽到"),
            ]);
            if (PARALLEL) parallel_tasks.push(task);
            else {
                const result = await task;
                if (result) log(result);
                if (typeof result === "object") {
                    issuer.logger("簽到")(`[簽到] ✨✨✨ 已連續簽到天數: ${result.days} 天 ✨✨✨`);
                }
                page.close();
            }
            if (GH_PAT) issuer.update_task("簽到", { status: "完成" });
        }

        if (AUTO_ANSWER_ANIME) {
            if (GH_PAT) issuer.update_task("答題", { status: "執行中" });
            let page = await new_page();
            let task = Promise.race([
                answer_anime_automation({ page, logger: GH_PAT ? issuer.logger("答題") : null }).catch(err_handler),
                sleep(10 * 60 * 1000, "[Timed Out] 答題"),
            ]);
            if (PARALLEL) parallel_tasks.push(task);
            else {
                const result = await task;
                if (result) log(result);
                if (typeof result === "object") {
                    issuer.logger("答題")(`[動畫瘋答題] ✨✨✨ 獲得 ${result.reward} 巴幣 ✨✨✨`);
                }
                page.close();
            }
            if (GH_PAT) issuer.update_task("答題", { status: "完成" });
        }

        if (AUTO_DRAW) {
            if (GH_PAT) issuer.update_task("抽獎", { status: "執行中" });
            let page = await new_page();
            let task = Promise.race([
                draw_automation({ page, logger: GH_PAT ? issuer.logger("抽獎") : null }),
                sleep(2 * 60 * 60 * 1000, "[Timed Out] 抽獎").catch(err_handler),
            ]);
            if (PARALLEL) parallel_tasks.push(task);
            else {
                const result = await task;
                if (result) log(result);
                if (typeof result === "object") {
                    issuer.logger("抽獎")(`[抽抽樂] ✨✨✨ 獲得 ${result.lottery} 個抽獎機會 ✨✨✨`);
                    if (Object.keys(result.unfinished).length) {
                        issuer.logger("抽獎")(`[抽抽樂] 尚未完成: \n ${JSON.stringify(result.unfinished, null, 2)}`);
                    }
                }
                page.close();
            }
            if (GH_PAT) issuer.update_task("抽獎", { status: "完成" });
        }

        if (PARALLEL) await Promise.all(parallel_tasks);

        if (browser) {
            // 登出帳號
            let page = await new_page();
            await bahamut_logout({ page, logger: GH_PAT ? issuer.logger("登入") : null }).catch(err_handler);
            await page.close();

            await browser.close();
        }

        if (GH_PAT) await issuer.end();
    }

    log("巴哈姆特自動化已執行完畢！感謝您的使用！\n");
    finishTransaction();
    return true;
}

async function new_page() {
    let page = await browser.newPage();
    await page.setUserAgent(UserAgent);
    await page.setDefaultNavigationTimeout(10 * 1000);
    return page;
}

async function param_parser(args) {
    let { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT } = args;

    if (!USERNAME) throw new Error(`缺少巴哈姆特帳號`);
    if (!PASSWORD) throw new Error(`缺少巴哈姆特密碼`);

    AUTO_SIGN = AUTO_SIGN == "true" || AUTO_SIGN == "1" || false;
    AUTO_SIGN_DOUBLE = AUTO_SIGN_DOUBLE == "true" || AUTO_SIGN_DOUBLE == "1" || false;
    AUTO_DRAW = AUTO_DRAW == "true" || AUTO_DRAW == "1" || false;
    AUTO_ANSWER_ANIME = AUTO_ANSWER_ANIME == "true" || AUTO_ANSWER_ANIME == "1" || false;
    HEADLESS = !(HEADLESS == "false" || HEADLESS == "0" || false);
    PARALLEL = PARALLEL == "true" || PARALLEL == "1" || false;
    GH_PAT = GH_PAT || "";

    return { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME, HEADLESS, PARALLEL, GH_PAT };
}

exports.main = main;
