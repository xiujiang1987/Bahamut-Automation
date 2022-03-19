import EventEmitter from "node:events";
import playwright from "playwright";

const BRWOSER_TYPES = ["chromium", "firefox", "webkit"] as const;

export class Browser extends EventEmitter {
    private browser: playwright.Browser = null;
    private context: playwright.BrowserContext = null;
    private user_agent: string = "";

    constructor(
        public browser_type: typeof BRWOSER_TYPES[number] = "firefox",
        public browser_config: playwright.LaunchOptions,
    ) {
        super();
        if (!BRWOSER_TYPES.includes(browser_type)) {
            browser_type = "firefox";
        }
    }

    log(...arg: unknown[]): void {
        this.emit("log", ...arg);
    }

    async launch(): Promise<this> {
        if (!this.browser) {
            this.log(`使用 ${this.browser_type} 瀏覽器`);
            const target = playwright[this.browser_type];
            this.browser = await target.launch(this.browser_config);
            this.emit("launched", this.browser);
        }

        if (!this.context) {
            const temp_page = await this.browser.newPage();
            this.user_agent =
                (await temp_page.evaluate(() => navigator.userAgent)).replace("Headless", "") +
                " BA/1";
            await temp_page.close();
            this.log("User-Agent:", this.user_agent);

            this.context = await this.browser.newContext({ userAgent: this.user_agent });
            this.emit("context_created", this.context);
        }

        return this;
    }

    async close(): Promise<this> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.context = null;
            this.user_agent = "";

            this.emit("closed");
        }
        return this;
    }

    async new_page(): Promise<playwright.Page> {
        if (!this.context) {
            throw new Error("No Context.");
        }

        const page = await this.context.newPage();
        this.emit("new_page", page);

        return page;
    }
}

export default Browser;
