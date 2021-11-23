module.exports = {
    modules: [
        "login",
        "ad_handler",
        "sign",
        "report",
        "answer",
        "report",
        "guild",
        "report",
        "lottery",
        "report",
        "sayloud",
        "report",
        "builder",
        "report",
        "logout",
        "telegram",
        "discord",
    ],
    params: {
        username: "",
        password: "",
        tg_id: "",
        dc_url: "",
        lottery_max_attempts: 20,
        builder: [
            { bsn: "60076", snA: "6515182", content: "$year$/$month$/$day$ $hour$:$minute$ OK!" },
            { bsn: "60111", snA: "120687", content: "$month$/$day$ $hour$:$minute$ Test! Test!" },
        ],
        sayloud: [{ to: "所有人", text: "$year$/$month$/$day$ OK! https://forum.gamer.com.tw/C.php?bsn=60076&snA=6515182" }],
    },
    browser: {
        type: "firefox", // firefox, chromium, webkit
        headless: true,
    },
};
