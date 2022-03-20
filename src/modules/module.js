// THIS IS AN EXAMPLE OF A MODULE

export default {
    name: "Example Module",
    description: "這是個範例模組，不要用它，看就好",
    async run({ page, params, shared, logger }) {
        // page 是可用來操作的 playwright 頁面
        await page.goto("https://www.google.com");

        // params 是模組的參數，使用者在設定檔中輸入
        const { a, b } = params;

        // shared 是共用的參數池，也是各模組輸出存放的地方
        const utils = shared.utils; // utils 模組的輸出

        // shared.flags 可以用來記錄一些資訊
        shared.flags.installed = { ...shared.flags?.installed, example: true };
        shared.flags.i_am_a_flag = "I am a flag";

        // 也可以從 flags 拿些東西
        const logged_in = shared.flags?.logged;

        // 用 logger 來印出訊息
        logger.log("紀錄");
        logger.info("訊息！");
        logger.warn("警告！！");
        logger.error("錯誤！！！");
        logger.success("成功！！！！");

        logger.info(`a = ${a}, b = ${b}`);

        // 喔對了！ shared 也可以 expose 一些函式讓其他模組使用
        logger.info(`時間：${utils.template("$year$/$month$/$day$ $hour$:$minute$:$second$")}`);

        // 回傳值會被放到 shared.example 可以被其他模組使用
        return { hi: "Hello World", logged_in };
    },
};
