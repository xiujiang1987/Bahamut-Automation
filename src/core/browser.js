const playwright = require("playwright");

const BRWOSER_TYPES = ["chromium", "firefox", "webkit"];

const DEFAULT_BROWSER_CONFIG = {
    headless: true,
    args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process", "--disable-gpu"],
    firefoxUserPrefs: {
        "dom.webaudio.enabled": false,
        "media.volume_scale": 0,
    },
};

let browser = null,
    context = null,
    user_agent = "";

async function open_browser(type = "firefox", config = {}, logger) {
    if (!BRWOSER_TYPES.includes(type)) {
        type = "firefox";
    }

    if (!browser) {
        logger.info("使用瀏覽器:", type);

        const target = playwright[type];

        browser = await target.launch(config, {
            ...DEFAULT_BROWSER_CONFIG,
            ...config,
        });
    }

    if (!context) {
        const temp_page = await browser.newPage();
        user_agent = (await temp_page.evaluate(() => navigator.userAgent)).replace("Headless", "") + " BA/1";
        await temp_page.close();

        logger.info("User-Agent:", user_agent);

        context = await browser.newContext({ userAgent: user_agent });
    }

    return { browser, context };
}

async function new_page(config = {}) {
    if (!context) throw new Error("No Context.");

    const page = await context.newPage(config);

    return page;
}

async function close_all() {
    if (browser) {
        await browser.close();
        return true;
    }

    return false;
}

module.exports = { open_browser, new_page, close_all };
