import { Module, utils } from "bahamut-automation";
import { Page } from "playwright-core";

const { goto } = utils;

export default {
    name: "簽到",
    description: "簽到模組",
    async run({ page, shared, params, logger }) {
        if (!shared.flags.logged) throw new Error("使用者未登入，無法簽到");

        logger.log(`開始執行`);

        await goto(page, "home");
        await page.waitForTimeout(2000);
        let { days, finishedAd, signin }: { days: number; finishedAd: boolean; signin: boolean } =
            await sign_status(page);
        const initial_signin = signin;
        logger.info(`已連續簽到天數: ${days}`);

        if (!signin) {
            logger.warn("今日尚未簽到 \u001b[91m✘\u001b[m");
            logger.log("正在嘗試簽到");
            await page.click("a#signin-btn").catch((err) => logger.error(err));
            await page.waitForTimeout(5000);
            logger.success("成功簽到 \u001b[92m✔\u001b[m");
        } else {
            logger.info("今日已簽到 \u001b[92m✔\u001b[m");
        }

        if (shared.ad_handler) {
            const max_attempts = +params.double_max_attempts || 3;
            for (let attempts = 0; attempts < max_attempts; attempts++) {
                try {
                    logger.log(`正在檢測雙倍簽到獎勵狀態`);

                    await goto(page, "home");
                    await page.waitForSelector("a#signin-btn");
                    await page.waitForTimeout(50);
                    await page.click("a#signin-btn");
                    await page.waitForSelector("text=領取雙倍巴幣");
                    await page.waitForTimeout(50);

                    if (!finishedAd) {
                        logger.log("尚未獲得雙倍簽到獎勵 \u001b[91m✘\u001b[m");

                        if (await page.$("div.popup-dailybox__bottom > button[disabled]")) {
                            throw new Error("Button disabled");
                        }

                        logger.log("嘗試觀看廣告以獲得雙倍獎勵，可能需要多達 1 分鐘");
                        await Promise.all([
                            page.waitForResponse(/\gampad\/ads/),
                            page.click("text=領取雙倍巴幣"),
                        ]);
                        await page.waitForTimeout(50);
                        if (await page.$("text=廣告能量補充中 請稍後再試。")) {
                            throw new Error("廣告能量補充中，請稍後再試");
                        }
                        await page.waitForSelector("button[type=submit]");
                        await page.waitForTimeout(100);
                        await page.click("button[type=submit]");

                        await page.waitForTimeout(3000);
                        await page.waitForSelector("ins iframe");
                        const ad_iframe = await page.$("ins iframe");
                        const ad_frame = await ad_iframe.contentFrame();

                        await shared.ad_handler({ ad_frame });

                        finishedAd = (await sign_status(page)).finishedAd;

                        if (finishedAd) {
                            logger.success("已觀看雙倍獎勵廣告 \u001b[92m✔\u001b[m");
                            break;
                        }
                        throw new Error("觀看雙倍獎勵廣告過程發生未知錯誤");
                    } else {
                        logger.info("已獲得雙倍簽到獎勵 \u001b[92m✔\u001b[m");
                        break;
                    }
                } catch (err) {
                    logger.error(err);
                    logger.error(
                        `觀看雙倍獎勵廣告過程發生錯誤，將再重試 ${
                            max_attempts - attempts - 1
                        } 次 \u001b[91m✘\u001b[m`,
                    );
                }
            }
        } else {
            logger.warn("雙倍簽到獎勵需使用 ad_handler 模組");
        }

        const final = await sign_status(page);

        const result = {
            signed: !!final.signin,
            doubled: !!final.finishedAd,
            days: final.days as number,
        };

        if (shared.report) {
            shared.report.reports["簽到"] = report(result);
        }

        logger.log(`執行完畢 ✨`);

        return result;
    },
} as Module;

async function sign_status(page: Page) {
    const { data } = await page.evaluate(async () => {
        const controller = new AbortController();

        setTimeout(() => controller.abort(), 30000);

        const r = await fetch("https://www.gamer.com.tw/ajax/signin.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=2",
            signal: controller.signal,
        });
        return r.json();
    });

    return data;
}

function report({ days, signed, doubled }: { days: number; signed: boolean; doubled: boolean }) {
    let body = `# 簽到\n\n`;

    body += `✨✨✨ 已連續簽到 ${days} 天 ✨✨✨\n`;
    if (signed) body += `🟢 今日已簽到\n`;
    else body += `❌ 今日尚未簽到\n`;
    if (doubled) body += `🟢 已獲得雙倍簽到獎勵\n`;
    else body += `❌ 尚未獲得雙倍簽到獎勵\n`;

    body += "\n";
    return body;
}
