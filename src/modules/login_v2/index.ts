import fetch from "node-fetch";
import { authenticator } from "otplib";
import { ILogger, Page } from "../_module";

const parameters = [
    { name: "username", required: true },
    { name: "password", required: true },
    { name: "twofa", required: false },
    { name: "login_max_attempts", required: false },
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
        const log = (...args: any[]) => logger.log("\u001b[95m[login v2]\u001b[m", ...args);
        const error = (...args: any[]) => logger.error("\u001b[95m[login v2]\u001b[m", ...args);
        let result: any = {};
        log(`Login v2 started`);
        let bahaRune = "";
        let bahaEnur = "";
        const max_attempts = +params.login_max_attempts || 3;
        for (let i = 0; i < max_attempts; i++) {
            const twofa =
                params.twofa && params.twofa.length != 0
                    ? `&twoStepAuth=${authenticator.generate(params.twofa)}`
                    : "";
            const requestData = `uid=${encodeURIComponent(
                params.username,
            )}&passwd=${encodeURIComponent(params.password)}&vcode=6666${twofa}`;
            try {
                let res = await fetch("https://api.gamer.com.tw/mobile_app/user/v3/do_login.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Cookie: "ckAPP_VCODE=6666",
                    },
                    body: requestData,
                });
                const body = await res.json();
                if (body.userid) {
                    const cookies = res.headers.get("set-cookie");
                    bahaRune = cookies.split(/(BAHARUNE=\w+)/)[1].split("=")[1];
                    bahaEnur = cookies.split(/(BAHAENUR=\w+)/)[1].split("=")[1];
                    log(`✅登入成功`);
                    break;
                } else {
                    result = body.message;
                }
            } catch (err) {
                error(err);
                result.error = err;
            }
            error(`❌登入失敗: `, result.error);
            await page.waitForTimeout(1000);
        }
        if (bahaRune !== "" && bahaEnur !== "") {
            await page.goto("https://www.gamer.com.tw/");
            const context = page.context();
            await context.addInitScript(
                ([BAHAID, BAHARUNE, BAHAENUR]) => {
                    document.cookie = `BAHAID=${BAHAID}; path=/; domain=.gamer.com.tw`;
                    document.cookie = `BAHARUNE=${BAHARUNE}; path=/; domain=.gamer.com.tw`;
                    document.cookie = `BAHAENUR=${BAHAENUR}; path=/; domain=.gamer.com.tw`;
                },
                [params.username, bahaRune, bahaEnur],
            );
            await page.goto("https://www.gamer.com.tw/");
            await page.waitForTimeout(1000);
            log(`✅登入 Cookie 已載入`);
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
};
