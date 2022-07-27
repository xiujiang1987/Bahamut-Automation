import { Module, utils } from "bahamut-automation";

const { goto, template } = utils;

export default {
    name: "勇者大聲說",
    description: "發佈勇者大聲說",
    async run({ page, shared, params, logger }) {
        if (!shared.flags.logged) throw new Error("使用者未登入，無法發佈勇者大聲說");

        const sayloud = params.sayloud;
        if (sayloud.length < 1) return { success: false };

        await goto(page, "user", "");

        // randomly select one item of sayloud
        const item = sayloud[Math.floor(Math.random() * sayloud.length)];
        const to = template(item.to);
        const text = template(item.text);

        const status = await page.evaluate(
            async ({ to, text }) => {
                const form = await fetch("https://home.gamer.com.tw/ajax/sayloud1.php?re=0", {
                    method: "POST",
                    body: new URLSearchParams(),
                }).then((r) => r.text());

                if (form.includes("目前仍有大聲說在放送")) {
                    return 2;
                }

                const div = document.createElement("div");
                div.innerHTML = form;
                const token = div.querySelector<HTMLInputElement>("[name=token]").value;

                const send = await fetch("https://home.gamer.com.tw/ajax/sayloud2.php", {
                    method: "POST",
                    body: new URLSearchParams({ idType: "2", nick: to, content: text, token }),
                }).then((r) => r.text());

                return send;
            },
            { to, text },
        );

        if (status === 2) {
            logger.warn("目前仍有大聲說在放送");
            return {
                success: false,
                reason: "目前仍有大聲說在放送",
                report: "勇者大聲說： 發送失敗 ",
            };
        } else {
            logger.success("放送成功 時間：" + status);
        }

        return { success: true, time: status, report: "勇者大聲說： 發送成功 " + status };
    },
} as Module;
