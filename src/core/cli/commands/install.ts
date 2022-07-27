import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { get_root } from "../../lib/index.js";

export function install(type?: string) {
    if (!type) {
        console.log(
            fs
                .readdirSync(
                    path.resolve(get_root(), "node_modules", "playwright-core", ".local-browsers"),
                )
                .filter((x) => !x.startsWith(".")),
        );
        return;
    }

    if (!["firefox", "chromium", "chrome", "webkit"].includes(type)) {
        throw new Error(`不支援的瀏覽器：${type}`);
    }
    try {
        execSync(`npx playwright install ${type} --with-deps`, {
            env: process.env,
            encoding: "utf8",
            stdio: "inherit",
        });
    } catch (err) {
        console.error(`安裝失敗：${err.message}`);
        process.exit(1);
    }
}
