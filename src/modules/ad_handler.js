exports.parameters = [];

let _log = () => {},
    _catchError = () => {};

exports.run = async function ({ log, catchError }) {
    _log = log;
    _catchError = catchError;
    log("已設定 Google AD 處理程式");
    return ad_handler;
};

async function ad_handler(ad_frame, log = _log, catchError = _catchError) {
    log("Google AD 處理程式: Start");
    try {
        await ad_frame.waitForTimeout(1000);
        if (await ad_frame.$(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton"))
            await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton");

        await Promise.race([
            ad_frame.waitForSelector(".videoAdUiSkipContainer.html5-stop-propagation > button", { visible: true, timeout: 35000 }),
            checkTopRightClose(ad_frame),
            checkVideoEnded(ad_frame),
            // ad_frame.waitForSelector("#google-rewarded-video > img:nth-child(4)", { visible: true, timeout: 35000 }),
        ]).catch(() => {});
        await ad_frame.waitForTimeout(1000);

        if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
            await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button");
        else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon");
        else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)")) await ad_frame.click("#google-rewarded-video > img:nth-child(4)");
        else if (await checkVideoEnded(ad_frame)) {
        } else throw new Error("發現未知類型的廣告");
    } catch (err) {
        if (ad_frame) log(ad_frame.url());
        else log("No AD Frame");
        catchError(err);
    }

    await ad_frame.waitForTimeout(2000);
    log("Google AD 處理程式: Finished");
}

async function checkVideoEnded(ad_frame) {
    const videoElement = await ad_frame.waitForSelector("video");
    if (await videoElement.evaluate((node) => node.ended)) return true;

    return videoElement.evaluate((node) => {
        return new Promise((r) => {
            node.addEventListener("ended", () => {
                r(true);
            });
        });
    });
}

function checkTopRightClose(ad_frame) {
    return new Promise(async (r) => {
        try {
            const count_down = await ad_frame.$("#count_down");
            if (count_down) {
                const seconds = +(await count_down.evaluate((node) => node.innerText)).replace(/[^0-9]/g, "");
                setTimeout(r, (seconds + 1) * 1000);
            } else {
                setTimeout(r, 35 * 1000);
            }
        } catch (err) {
            setTimeout(r, 35 * 1000);
        }
    });
}
