const { log, err_handler } = require("./utils.js");

async function bahamut_login({ page, USERNAME, PASSWORD, logger }) {
    let log2 = (msg) => {
        log(msg);
        if (logger) logger(msg);
    };

    log2(`開始執行帳號登入程序`);
    await page.goto("https://www.gamer.com.tw/");
    await page.waitForTimeout(2000);

    let attempts = 3;
    while (attempts-- > 0) {
        log2("正在檢測登入狀態");
        await page.goto("https://www.gamer.com.tw/");
        await page.waitForTimeout(2000);

        let not_login_signal = await page.$("div.TOP-my.TOP-nologin");
        if (not_login_signal) {
            log2("登入狀態: 未登入");

            await page.goto("https://user.gamer.com.tw/login.php");
            await page.waitForTimeout(2000);
            log2("嘗試登入中");
            await page.$eval("input#uidh", (node) => (node.value = "")).catch(err_handler);
            await page.$eval("input[type=password]", (node) => (node.value = "")).catch(err_handler);
            await page.type("input#uidh", USERNAME, { delay: 101 }).catch(err_handler);
            await page.waitForTimeout(1000);
            await page.type("input[type=password]", PASSWORD, { delay: 101 }).catch(err_handler);
            await page.waitForTimeout(1000);
            await page.click("button[type=submit]").catch(err_handler);
            await page.waitForNavigation().catch(err_handler);
            await page.waitForTimeout(2000);
            log2("已嘗試登入，重新檢測登入狀態");
        } else {
            log2("登入狀態: 已登入");
            break;
        }
    }

    log2(`帳號登入程序已完成\n`);
}

async function bahamut_logout({ page, logger }) {
    let log2 = (msg) => {
        log(msg);
        if (logger) logger(msg);
    };

    log2(`開始執行帳號登出程序`);
    await page.goto("https://user.gamer.com.tw/logout.php");
    await page.waitForTimeout(2000);
    await page
        .evaluate(() => {
            logout();
        })
        .catch(err_handler);
    await page.waitForNavigation().catch(err_handler);

    log2(`帳號登出程序已完成\n`);
}

exports.bahamut_login = bahamut_login;
exports.bahamut_logout = bahamut_logout;
