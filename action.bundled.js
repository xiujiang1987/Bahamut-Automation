const fs$1 = require("fs");

function log$1(msg) {
    console.log(msg);
    fs$1.appendFileSync("./log/log.txt", `[${new Date().toLocaleString("en-GB", { timeZone: "Asia/Taipei" })}] ${msg} \n`);
}

async function err_handler(err, page = null) {
    let time = Date.now();
    log$1(`\n<ERROR ${time}> ` + err);
    if (page) await page.screenshot({ path: `./screenshot/.err.${time}.jpg`, type: "jpeg" });
}

async function bahamut_login({ browser, USERNAME, PASSWORD }) {
    log$1(`開始執行帳號登入程序`);

    log$1("正在檢測登入狀態");
    let page = await browser.newPage();
    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);

    let not_login_signal = await page.$("div.TOP-my.TOP-nologin");
    if (not_login_signal) {
        log$1("登入狀態: 未登入");

        await page.goto("https://user.gamer.com.tw/login.php");
        await page.waitForTimeout(2000);
        log$1("嘗試登入中");
        await page.type("input#uidh", USERNAME, { delay: 101 }).catch(err_handler);
        await page.waitForTimeout(1000);
        await page.type("input[type=password]", PASSWORD, { delay: 101 }).catch(err_handler);
        await page.waitForTimeout(1000);
        await page.click("button[type=submit]").catch(err_handler);
        await page.waitForNavigation().catch(err_handler);
        await page.waitForTimeout(2000);
        log$1("成功登入");
    } else {
        log$1("登入狀態: 已登入");
    }

    await page.close();
    log$1(`帳號登入程序已完成`);
}

async function sign_automation({ browser, AUTO_SIGN_DOUBLE }) {
    log$1(`開始執行自動簽到程序`);

    log$1("正在嘗試簽到");
    let page = await browser.newPage();
    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);

    await page.click("a#signin-btn").catch(err_handler);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `./screenshot/${Date.now()}.jpg`, type: "jpeg" });
    log$1("已簽到！");

    await page.waitForTimeout(1000);
    log$1(`自動簽到程序已完成`);

    if (AUTO_SIGN_DOUBLE) {
        log$1(`開始執行自動觀看雙倍簽到獎勵廣告程序`);
        log$1("正在檢測雙倍簽到獎勵狀態");
        let reward_doubled = await page.$("a.popoup-ctrl-btn.is-disable");
        if (!reward_doubled) {
            log$1("雙倍簽到獎勵狀態: 尚未獲得雙倍簽到獎勵");

            log$1("嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
            await page.click("a.popoup-ctrl-btn").catch(err_handler);
            await page.waitForTimeout(5000);
            await page.click("button[type=submit]").catch(err_handler);

            await page.waitForTimeout(3000);
            await page.waitForSelector("ins iframe").catch(err_handler);
            const ad_iframe = await page.$("ins iframe").catch(err_handler);
            const ad_frame = await ad_iframe.contentFrame().catch(err_handler);

            await ad_frame.waitForSelector(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton").catch(err_handler);
            await page.waitForTimeout(3000);
            await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton").catch(err_handler);

            await page.waitForTimeout(35000);
            if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
                await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button").catch(err_handler);
            else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon").catch(err_handler);
            else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)"))
                await ad_frame.click("#google-rewarded-video > img:nth-child(4)").catch(err_handler);

            log$1("已觀看雙倍獎勵廣告");
        } else {
            log$1("雙倍簽到獎勵狀態: 已獲得雙倍簽到獎勵");
        }

        log$1(`自動觀看雙倍簽到獎勵廣告程序已完成`);
    }

    await page.close();
    log$1(`自動簽到程序已完成`);
}

async function draw_automation({ browser }) {
    log$1(`開始執行福利社自動抽抽樂程序`);

    log$1("正在尋找抽抽樂");
    let page = await browser.newPage();
    await page.goto("https://fuli.gamer.com.tw/");
    let items = await page.$$(".type-tag ");
    for (let i = items.length - 1; i >= 0; i--) {
        let is_draw = await items[i].evaluate((node) => node.innerHTML === "抽抽樂");
        if (!is_draw) items.splice(i, 1);
    }
    log$1(`找到 ${items.length} 個抽抽樂`);

    for (let idx = 0; idx < items.length; idx++) {
        log$1(`正在嘗試執行第 ${idx + 1} 個抽抽樂`);
        await page.goto("https://fuli.gamer.com.tw/").catch(err_handler);
        items = await page.$$(".type-tag ");
        for (let i = items.length - 1; i >= 0; i--) {
            let is_draw = await items[i].evaluate((node) => node.innerHTML === "抽抽樂");
            if (!is_draw) items.splice(i, 1);
        }
        items[idx].click().catch(err_handler);
        await page.waitForNavigation().catch(err_handler);

        while (true) {
            await page.waitForTimeout(2000);

            if (await page.$(".btn-base.c-accent-o.is-disable")) {
                log$1(`第 ${idx + 1} 個抽抽樂的廣告免費次數已用完`);
                break;
            }

            let name = (await page.title()).replace("勇者福利社 - ", "").replace(" - 巴哈姆特", "");
            log$1("正在執行：" + name);
            log$1("可能需要多達 1 分鐘");

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
            {
                await page.click("#agree-confirm");
                await page.waitForTimeout(500);
                await page.click("#buyD > div.pbox-btn > a");
                await page.waitForTimeout(800);
                await page.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary");
                await page.waitForNavigation().catch(err_handler);
                await page.waitForTimeout(1500);
                await page.click("div.wrapper.wrapper-prompt > div > div > div.form__buttonbar > button");
                await page.waitForNavigation().catch(err_handler);
                log$1("已完成一次抽抽樂：" + name);
            }
        }
    }

    await page.waitForTimeout(2000);
    log$1(`福利社自動抽抽樂程序已完成`);
}

const puppeteer = require("puppeteer");
const fs = require("fs");

let browser;

async function main(args) {
    if (!fs.existsSync("./log/")) fs.mkdirSync("./log/");
    if (!fs.existsSync("./screenshot/")) fs.mkdirSync("./screenshot/");
    log("\n==========\n");

    let { USERNAME, PASSWORD, AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME } = args;

    if (!USERNAME) console.error(`缺少巴哈姆特帳號`);
    if (!PASSWORD) console.error(`缺少巴哈姆特密碼`);

    AUTO_SIGN = AUTO_SIGN == "true" || AUTO_SIGN == "1" || false;
    AUTO_SIGN_DOUBLE = AUTO_SIGN_DOUBLE == "true" || AUTO_SIGN_DOUBLE == "1" || false;
    AUTO_DRAW = AUTO_DRAW == "true" || AUTO_DRAW == "1" || false;
    AUTO_ANSWER_ANIME = AUTO_ANSWER_ANIME == "true" || AUTO_ANSWER_ANIME == "1" || false;

    console.log(JSON.stringify({ AUTO_SIGN, AUTO_SIGN_DOUBLE, AUTO_DRAW, AUTO_ANSWER_ANIME }, null, 4));

    if (AUTO_SIGN || AUTO_DRAW || AUTO_ANSWER_ANIME) {
        browser = await puppeteer.launch({
            executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            userDataDir: "./.data",
            headless: true,
            defaultViewport: {
                width: 1000,
                height: 800,
                isMobile: false,
            },
            args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
        });

        await bahamut_login({ browser, USERNAME, PASSWORD });
    }

    if (AUTO_SIGN) {
        await sign_automation({ browser, AUTO_SIGN_DOUBLE });
    }

    if (AUTO_DRAW) {
        await draw_automation({ browser });
    }
}

const core = require("@actions/core");

(async () => {
    try {
        const USERNAME = core.getInput("username");
        const PASSWORD = core.getInput("password");
        const AUTO_SIGN = core.getInput("auto_sign");
        const AUTO_SIGN_DOUBLE = core.getInput("auto_sign_double");
        const AUTO_DRAW = core.getInput("auto_draw");
        const AUTO_ANSWER_ANIME = core.getInput("auto_answer_anime");

        await main({
            USERNAME,
            PASSWORD,
            AUTO_SIGN,
            AUTO_SIGN_DOUBLE,
            AUTO_DRAW,
            AUTO_ANSWER_ANIME,
        }).catch((error) => core.setFailed(error.message));
    } catch (error) {
        core.setFailed(error.message);
    }
})();
