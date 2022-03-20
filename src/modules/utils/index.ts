import type { Module } from "../_module";
import goto from "./goto";
import template from "./template";
import time from "./time";
import user from "./user";

export default {
    name: "Utils",
    description: "通用函式庫",
    async run({ logger, shared }) {
        shared.flags.installed = { ...shared.flags?.installed, utils: true };

        logger.info("已註冊通用函式庫");
        return { goto, template, time, user };
    },
} as Module;

export * from "./goto";
export * from "./template";
export * from "./time";
export * from "./user";
