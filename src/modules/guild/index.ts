import { Module } from "bahamut-automation";

export default {
    name: "公會簽到",
    description: "公會簽到模組，簽到已加入的公會",
    async run({ page, shared, params, logger }) {
        if (!shared.flags.logged) throw new Error("使用者未登入，無法進行公會簽到");

        let retry = +params.max_attempts || +shared.max_attempts || 3;
        while (retry--) {
            try {
                await page.goto("https://home.gamer.com.tw/joinGuild.php");
                await page.waitForTimeout(2000);
                const guilds = await page.evaluate(() => {
                    return [
                        ...document.querySelectorAll<HTMLAnchorElement>(".acgbox .acgboximg a"),
                    ].map((a) => a.href);
                });
                logger.log(`已加入 ${guilds.length} 個公會`);

                for (let _guild of guilds) {
                    try {
                        await page.goto(_guild);
                        await page.waitForTimeout(1000);
                        const name = await page.evaluate(() => {
                            // @ts-ignore
                            guild.sign();
                            return document.querySelector<HTMLHeadingElement>(
                                ".main-container_header_info h1",
                            ).innerText;
                        });
                        await page.waitForTimeout(2000);
                        logger.log(`已簽到 ${name}`);
                    } catch (err) {
                        logger.error(err);
                    }
                }
                break;
            } catch (err) {
                logger.error(err);
                await page.waitForTimeout(500);
            }
        }

        if (shared.report) {
            shared.report.reports["公會簽到"] = report();
        }

        return { report };
    },
} as Module;

function report() {
    let body = `# 公會簽到\n\n`;
    body += `🟢 已執行\n\n`;
    return body;
}
