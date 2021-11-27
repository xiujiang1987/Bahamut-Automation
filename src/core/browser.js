const EventEmitter = require("events");
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

class Browser extends EventEmitter {
    constructor(browser_type, browser_config, logger = null) {
        super();
        if (!BRWOSER_TYPES.includes(browser_type)) {
            browser_type = "firefox";
        }
        this.browser_type = browser_type;
        this.browser_config = browser_config;
        this.logger = logger;

        this.browser = null;
        this.context = null;
        this.user_agent = "";

        this.setup();
    }

    info(...arg) {
        if (this.logger) {
            this.logger.info(...arg);
        }
    }

    async setup() {}

    async launch() {
        if (!this.browser) {
            this.info("使用瀏覽器", this.browser_type);

            const target = playwright[this.browser_type];

            this.browser = await target.launch(this.browser_config, {
                ...DEFAULT_BROWSER_CONFIG,
                ...this.browser_config,
            });

            this.emit("launched", this.browser);
        }

        if (!this.context) {
            const temp_page = await this.browser.newPage();
            this.user_agent = (await temp_page.evaluate(() => navigator.userAgent)).replace("Headless", "") + " BA/1";
            await temp_page.close();

            this.info("User-Agent:", this.user_agent);

            this.context = await this.browser.newContext({ userAgent: this.user_agent });

            this.emit("context_created", this.context);
        }

        return this;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.context = null;
            this.user_agent = "";

            this.emit("closed");
        }
        return this;
    }

    async new_page(config = {}) {
        if (!this.context) throw new Error("No Context.");

        const page = await this.context.newPage(config);

        this.emit("new_page", page);

        return page;
    }
}

module.exports = Browser;
