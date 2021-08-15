exports.parameters = [];

exports.run = async ({ page, outputs, catchError, log }) => {
    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無需登出");

    log(`開始執行帳號登出程序`);
    await page.goto("https://user.gamer.com.tw/logout.php");
    await page.waitForTimeout(1000);
    await page
        .evaluate(() => {
            logout();
        })
        .catch(catchError);
    await page.waitForNavigation().catch(catchError);

    log(`帳號登出程序已完成`);
};
