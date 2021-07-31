const puppeteer = require("puppeteer-core");
const { catchFatal, catchError } = require("./error");

// 瀏覽器設定預設值
const DEFAULT_BROWSER_CONFIG = {
    path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    mobile: false,
    disposable: true,
    args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
};

let browser = null;

async function Browser(config = {}) {
    try {
        // 已經有開啟的瀏覽器，直接回傳
        if (browser) return browser;

        // 合併設定預設值
        config = Object.assign({}, DEFAULT_BROWSER_CONFIG, config);

        // 啟動瀏覽器
        browser = await puppeteer.launch({
            executablePath: config.path,
            userDataDir: config.disposable ? undefined : "./.data",
            headless: config.headless,
            defaultViewport: {
                width: config.mobile ? 414 : 1250,
                height: config.mobile ? 736 : 800,
                isMobile: config.mobile,
            },
            args: config.args,
        });

        return browser;
    } catch (err) {
        catchFatal(err);
    }
}

async function Page() {
    try {
        // 沒有開啟的瀏覽器
        if (!browser) throw new Error("瀏覽器未啟動");

        // 開啟新分頁
        const page = await browser.newPage();

        // 設定分頁資料
        await page.setUserAgent((await browser.userAgent()).replace("HeadlessChrome", "Chrome"));
        await page.setDefaultNavigationTimeout(10 * 1000);

        return page;
    } catch (err) {
        catchError(err);
    }
}

exports.Browser = Browser;
exports.Page = Page;
