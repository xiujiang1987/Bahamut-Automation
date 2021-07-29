async function ad_handler(ad_frame) {
    try {
        await ad_frame.waitForTimeout(2000);
        if (await ad_frame.$(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton"))
            await ad_frame.click(".rewardDialogueWrapper:not([style*=none]) .rewardResumebutton");

        await Promise.race([
            ad_frame.waitForSelector(".videoAdUiSkipContainer.html5-stop-propagation > button", { visible: true, timeout: 35000 }),
            ad_frame.waitForSelector("div#close_button_icon", { visible: true, timeout: 35000 }),
            // ad_frame.waitForSelector("#google-rewarded-video > img:nth-child(4)", { visible: true, timeout: 35000 }),
        ]).catch(() => {});
        await ad_frame.waitForTimeout(1000);

        if (await ad_frame.$(".videoAdUiSkipContainer.html5-stop-propagation > button"))
            await ad_frame.click(".videoAdUiSkipContainer.html5-stop-propagation > button");
        else if (await ad_frame.$("div#close_button_icon")) await ad_frame.click("div#close_button_icon");
        else if (await ad_frame.$("#google-rewarded-video > img:nth-child(4)")) await ad_frame.click("#google-rewarded-video > img:nth-child(4)");
        else throw new Error("發現未知類型的廣告");
    } catch (err) {
        console.debug(await ad_frame.url());
        err_handler(err);
    }

    await ad_frame.waitForTimeout(2000);
}

exports.ad_handler = ad_handler;
