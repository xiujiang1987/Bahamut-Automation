#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import { check } from "./commands/check.js";
import { example } from "./commands/example.js";
import { install } from "./commands/install.js";
import { run } from "./commands/run.js";
import { stats } from "./commands/stats.js";

process.env.TZ = "Asia/Taipei";

const package_json = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../../package.json"), "utf8"),
);

program.version(package_json.version, "-V, --version", "版本資訊");

program.command("check").description("檢查系統需求").action(check);
program.command("stats").description("顯示匿名統計資料").action(stats);
program.command("example").description("建立範例設定檔").action(example);
program.command("install [type]").description("安裝瀏覽器").action(install);

program
    .description("執行自動化")
    .option("-c, --config <path...>", "設定檔位置")
    .option("-o, --override <field...>", "覆蓋設定檔欄位")
    .addHelpText("after", "\n範例: bahamut-automation -c ./config.yml")
    .action(run);

program.parse();
