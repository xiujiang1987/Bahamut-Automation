import { Module, utils } from "bahamut-automation";

const { template } = utils;

export default {
    name: "自動回文",
    description: "自動回文模組，蓋樓？",
    async run({ page, shared, params, logger }) {
        if (!shared.flags.logged) {
            throw new Error("使用者未登入，無法自動回文蓋樓");
        }

        const builder = params.posts;
        if (builder == null) {
            if (shared.report) {
                shared.report.reports[
                    "自動回文蓋樓"
                ] = `# 自動回文蓋樓 \n\n❌ 未執行自動回文 沒有指定的文章`;
            }
            return { success: false };
        }

        for (let i = 0; i < builder.length; i++) {
            try {
                const { bsn, snA, content } = builder[i];
                logger.log(`正嘗試在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
                await page.goto(
                    `https://forum.gamer.com.tw/post1.php?bsn=${bsn}&snA=${snA}&type=2`,
                );
                await page.waitForTimeout(2000);

                // 備份詢問
                if (await page.$("dialog")) {
                    await page.click("dialog button");
                }
                await page.waitForTimeout(300);

                // 提示
                await page.evaluate(() => {
                    // @ts-ignore
                    if (onTipsClick) onTipsClick();
                });
                await page.waitForTimeout(300);

                // 切換模式
                await page.evaluate(() => {
                    if (
                        document.querySelector<HTMLInputElement>("#source").style.display === "none"
                    ) {
                        // @ts-ignore
                        bahaRte.toolbar.alternateView(true);
                    }
                });
                await page.waitForTimeout(300);

                // 輸入內容
                await page.$eval("#source", (elm: HTMLInputElement) => {
                    elm.value = "";
                });
                await page.type("#source", template(content), { delay: 11 });
                await page.waitForTimeout(300);

                // 發送
                await page.evaluate(() => {
                    // @ts-ignore
                    Forum.Post.post();
                });
                await page.waitForTimeout(300);
                await page.click("form[method=dialog] button[type=submit]");
                await page.waitForTimeout(5000);

                logger.success(`已在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
                if (i + 1 < builder.length) {
                    // 巴哈 1 分鐘發文限制
                    logger.log(`等待發文冷卻 1 分鐘`);
                    await page.waitForTimeout(60 * 1000);
                }
            } catch (err) {
                logger.error(err);
            }
        }
        if (shared.report) {
            shared.report.reports["自動回文蓋樓"] = `# 自動回文蓋樓 \n\n🟢 已完成`;
        }
        return { success: true };
    },
} as Module;
