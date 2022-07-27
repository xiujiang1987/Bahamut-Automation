import { Module } from "bahamut-automation";

export default {
    name: "登出",
    description: "登出巴哈姆特",
    run: async ({ page, shared, logger }) => {
        if (!shared.flags.logged) throw new Error("使用者未登入，無需登出");

        logger.log(`開始執行`);
        await page.goto("https://user.gamer.com.tw/logout.php");
        await page.waitForSelector(
            "div.wrapper.wrapper-prompt > div > div > div.form__buttonbar > button",
        );
        await Promise.all([
            page.click("div.wrapper.wrapper-prompt > div > div > div.form__buttonbar > button"),
            page.waitForNavigation(),
        ]);

        logger.log(`帳號已登出`);
        shared.flags.logged = false;
    },
} as Module;
