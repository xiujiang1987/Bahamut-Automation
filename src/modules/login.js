exports.parameters = [
    {
        name: "username",
        required: true,
    },
    {
        name: "password",
        required: true,
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
                await page.$eval("input#uidh", (node) => (node.value = "")).catch(catchError);
                await page.$eval("input[type=password]", (node) => (node.value = "")).catch(catchError);
                await page.type("input#uidh", params.username, { delay: 101 }).catch(catchError);
                await page.waitForTimeout(500);
                await page.type("input[type=password]", params.password, { delay: 101 }).catch(catchError);
                await page.waitForTimeout(500);
                await page.click("button[type=submit]").catch(catchError);
                await page.waitForNavigation().catch(catchError);
                await page.waitForTimeout(1000);
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
