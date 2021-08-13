exports.parameters = [
    {
        name: "builder",
        required: true,
        example: [{ bsn: "", snA: "", content: "" }],
    },
];

exports.run = async ({ page, outputs, params, catchError, log }) => {
    if (!outputs.login || !outputs.login.success) throw new Error("使用者未登入，無法發佈勇者大聲說");

    const { build } = params;
    if (build.length < 1) return { success: false };

    for (let i = 0; i < build.length; i++) {
        try {
            const { bsn, snA, content } = build[i];
            log(`正嘗試在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
            await page.goto(`https://forum.gamer.com.tw/post1.php?bsn=${bsn}&snA=${snA}&type=2`);
            await page.waitForTimeout(2000);
            await page.evaluate(() => {
                onTipsClick();
            });
            await page.waitForTimeout(300);
            await page.evaluate(() => {
                bahaRte.toolbar.alternateView(true);
            });
            await page.waitForTimeout(300);
            await page.type("#source", replace(content), { delay: 11 });
            await page.waitForTimeout(300);
            await page.evaluate(() => {
                Forum.Post.post();
            });
            await page.waitForTimeout(300);
            await page.click("form[method=dialog] button[type=submit]");
            log(`已在 https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA} 回文`);
            if (i + 1 < build.length) {
                // 巴哈 1 分鐘發文限制
                log(`等待發文冷卻 1 分鐘`);
                await page.waitForTimeout(60 * 1000);
            }
        } catch (err) {
            catchError(err);
        }
    }

    return { success: true };
};

function replace(str) {
    const t = time();
    const rules = [
        [/\$time\$/g, `$year$/$month$/$day$ $hour$:$minute$:$second$`],
        [/\$year\$/g, t[0]],
        [/\$month\$/g, t[1]],
        [/\$day\$/g, t[2]],
        [/\$hour\$/g, t[3]],
        [/\$minute\$/g, t[4]],
        [/\$second\$/g, t[5]],
    ];

    for (let i = 0; i < rules.length; i++) str = str.replace(rules[i][0], rules[i][1]);

    return str;
}

function time() {
    const date = new Date().toLocaleString("en", { timeZone: "Asia/Taipei" }).split(", ");
    let [month, day, year] = date[0].split("/");
    let [hour, minute, second] = date[1].match(/\d{1,2}/g);

    if (+hour === 12 && date[1].toLowerCase().includes("am")) hour = String(+hour - 12);
    if (+hour < 12 && date[1].toLowerCase().includes("pm")) hour = String(+hour + 12);
    return [year, month, day, hour, minute, second];
}
