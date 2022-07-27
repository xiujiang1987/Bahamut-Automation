import fs from "node:fs";
import path from "node:path";
import { get_root } from "../../lib/index.js";

export function example() {
    const root = get_root();
    const example_path = path.resolve(root, "example", "config.yml");
    if (!fs.existsSync(path.resolve("config.yml"))) {
        fs.copyFileSync(example_path, "config.yml");
        console.log(`已複製範例設定檔到 ${path.resolve("config.yml")}`);
    } else {
        console.log("config.yml 已存在");
    }
}
