import { ILogger, Page } from "../_module";

const parameters = [
    { name: "username", required: true },
    { name: "BAHARUNE", required: true },
    { name: "BAHAENUR", required: true },
] as const;

export default {
    parameters,
    run: async ({
        page,
        params,
        logger,
    }: {
        page: Page;
        params: {
            [K in typeof parameters[number]["name"]]: string;
        };
        logger: ILogger;
    }) => {
        const log = (...m: unknown[]) => logger.log("\u001b[95m[Cookie Loader]\u001b[m", ...m);

        log(
            `載入登入 Cookie ${
                params.BAHARUNE.substring(0, 4) +
                "****" +
                params.BAHARUNE.substring(params.BAHARUNE.length - 4)
            }`,
        );
        await page.goto("https://www.gamer.com.tw/");
        const context = page.context();
        context.addInitScript(
            ([BAHAID, BAHARUNE, BAHAENUR]) => {
                document.cookie = `BAHAID=${BAHAID}; path=/; domain=.gamer.com.tw`;
                document.cookie = `BAHARUNE=${BAHARUNE}; path=/; domain=.gamer.com.tw`;
                document.cookie = `BAHAENUR=${BAHAENUR}; path=/; domain=.gamer.com.tw`;
            },
            [params.username, params.BAHARUNE, params.BAHAENUR],
        );
        log(`登入 Cookie 已載入`);

        return true;
    },
};
