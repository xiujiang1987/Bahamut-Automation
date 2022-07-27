import { Module, utils } from "bahamut-automation";

export default {
    name: "Utils",
    description: "通用函式庫",
    async run({ logger, shared }) {
        shared.flags.installed = { ...shared.flags?.installed, utils: true };

        logger.info("已註冊通用函式庫");
        return utils;
    },
} as Module;
