import { Module } from "bahamut-automation";

export default {
    name: "測試用模組",
    description: "測試用模組，測試瀏覽器支不支援 MP4",
    async run({ page, logger }) {
        await import("./video").then((m) => m.default(page, logger));
    },
} as Module;
