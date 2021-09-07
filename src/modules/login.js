const { authenticator } = require("otplib");

exports.parameters = [
    {
        name: "username",
        required: true,
    },
    {
        name: "password",
        required: true,
    },
    {
        name: "twofa",
        required: false,
    },
];

exports.run = async ({ page, params, catchError, log }) => {
    let success = false;
    log(`開始執行帳號登入程序`);
    await page.goto("https://www.gamer.com.tw/").catch(catchError);
    await page.waitForTimeout(1000);

    let attempts = 5;
    while (attempts-- > 0) {
        try {
            log("正在檢測登入狀態");
            await page.goto("https://www.gamer.com.tw/");
            await page.waitForTimeout(1000);

            let not_login_signal = await page.$("div.TOP-my.TOP-nologin");
            if (not_login_signal) {
                log("登入狀態: 未登入");

                await page.goto("https://user.gamer.com.tw/login.php").catch(catchError);
                await page.waitForTimeout(2000);
                log("嘗試登入中");
                if (!params.username || !params.password) throw new Error("帳號或密碼不能為空");
                await page.$eval("input.form-control[type=text]", (node) => (node.value = "")).catch(catchError);
                await page.$eval("input.form-control[type=password]", (node) => (node.value = "")).catch(catchError);
                await page.type("input.form-control[type=text]", params.username, { delay: 101 }).catch(catchError);
                await page.waitForTimeout(500);
                await page.type("input.form-control[type=password]", params.password, { delay: 101 }).catch(catchError);
                await page.waitForTimeout(500);
                await page.click("a#btn-login").catch(catchError);
                await page.waitForTimeout(1000);
                await check2FA(page, params, catchError, log);
                await page.waitForTimeout(3000);

                if (attempts > 0) log("已嘗試登入，重新檢測登入狀態");
            } else {
                log("登入狀態: 已登入");
                success = true;
                break;
            }
        } catch (err) {
            catchError(err);
            log("登入時發生錯誤，重新嘗試中");
        }
    }

    log(`帳號登入程序已完成`);

    return { success };
};

async function check2FA(page, params, catchError, log) {
    let twoFA = await page.$("[name=twoStepAuth]");
    if (twoFA) {
        log("有啟用 2FA");
        if (!params.twofa) throw new Error("未提供 2FA 種子碼");
        const code = authenticator.generate(params.twofa);
        await page.type("[name=twoStepAuth]", code, { delay: 10 }).catch(catchError);
        await page
            .evaluate(() => {
                document.forms[0].submit();
            })
            .catch(catchError);
        return;
    } else {
        log("沒有啟用 2FA");
        return;
    }
}
