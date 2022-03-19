// THIS IS AN EXAMPLE OF A MODULE

export default {
    name: "Example Module",
    description: "這是個範例模組，不要用它，看就好",
    async run({ page, params, shared, logger }) {
        // 用 logger 來印出訊息
        logger.log("紀錄");
        logger.info("訊息！");
        logger.warn("警告！！");
        logger.error("錯誤！！！");

        // shared.flags 可以用來記錄一些資訊
        shared.flags.installed = { ...shared.flags?.installed, example: true };
        shared.flags.i_am_a_flag = "I am a flag";

        // 回傳值會被放到 shared["example"] 可以被其他模組使用
        return { hi: "Hello World" };
    },
};
