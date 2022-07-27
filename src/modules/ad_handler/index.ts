import { Logger, Module } from "bahamut-automation";
import { Frame } from "playwright-core";

type ad_handler_args = {
    ad_frame: Frame;
    timeout?: number;
    log?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
};

let _logger: Logger;

export default {
    name: "Google AD 處理程式",
    description: "註冊處理 Google AD 的程式",
    async run({ page, logger }) {
        _logger = logger;
        await page.exposeFunction("ad_handler", ad_handler);
        logger.info("已註冊 Google AD 處理程式");
        return ad_handler;
    },
} as Module;

async function ad_handler({ ad_frame, timeout = 60 }: ad_handler_args) {
    _logger.log("Google AD 處理程式: Start");

    const result = await Promise.race([
        sleep(timeout * 1000, "timed out"),
        (async () => {
            try {
                await ad_frame.waitForTimeout(1000);
                if (
                    await ad_frame.$(
                        ".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton",
                    )
                )
                    await ad_frame.click(
                        ".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton",
                    );

                if (await ad_frame.$(".rewardResumebutton:visible")) {
                    await ad_frame.click(".rewardResumebutton:visible");
                }

                await Promise.race([
                    ad_frame.waitForSelector(
                        ".videoAdUiSkipContainer.html5-stop-propagation > button",
                        { timeout: 35000 },
                    ),
                    checkTopRightClose(ad_frame),
                    checkVideoEnded(ad_frame),
                    // ad_frame.waitForSelector("#google-rewarded-video > img:nth-child(4)", { visible: true, timeout: 35000 }),
                ]).catch(() => {});
                await ad_frame.waitForTimeout(1000);

                if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
                    await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button");
                else if (await ad_frame.$("div#close_button_icon"))
                    await ad_frame.click("div#close_button_icon");
                else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)"))
                    await ad_frame.click("#google-rewarded-video > img:nth-child(4)");
                else if (await checkVideoEnded(ad_frame)) {
                } else throw new Error("發現未知類型的廣告");

                await ad_frame.waitForTimeout(2000);
            } catch (err) {
                _logger.error(err);
            }
        })(),
    ]);
    if (result === "timed out") {
        _logger.log("Google AD 處理程式: Timed Out");
    } else {
        _logger.log("Google AD 處理程式: Finished");
    }
}

async function checkVideoEnded(ad_frame: Frame) {
    const videoElement = await ad_frame.waitForSelector("video");
    if (await videoElement.evaluate((elm: HTMLVideoElement) => elm.ended)) return true;

    return videoElement.evaluate((elm: HTMLVideoElement) => {
        return new Promise((r) => elm.addEventListener("ended", () => r(true)));
    });
}

function checkTopRightClose(ad_frame: Frame) {
    return new Promise(async (r) => {
        try {
            const count_down = await ad_frame.$("#count_down");
            if (count_down) {
                const seconds = +(
                    await count_down.evaluate((elm: HTMLElement) => elm.innerText)
                ).replace(/[^0-9]/g, "");
                setTimeout(r, (seconds + 1) * 1000);
            } else {
                setTimeout(r, 35 * 1000);
            }
        } catch (err) {
            setTimeout(r, 35 * 1000);
        }
    });
}

function sleep(t = 1000, msg: any) {
    return new Promise((r) => setTimeout(() => r(msg), t));
}
