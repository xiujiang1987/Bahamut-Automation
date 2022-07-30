import { execSync } from "node:child_process";

export async function check() {
    const keys: Record<string, [boolean, string, string]> = {
        node: [true, "node -v", "用來跑 JS，最低要求 v17 以上"],
        pnpm: [false, "pnpm -v", "非必要，但可用 pnpm i -g bahamut-automation 全域安裝"],
        ffmpeg: [true, "ffmpeg -version", "解 reCAPTCHA 時音檔處理需要"],
    };

    console.log("系統需求檢查");
    for (const key in keys) {
        const [required, command, description] = keys[key];
        try {
            const result = execSync(command, { encoding: "utf8" }).toString();
            console.log(`\x1b[93m${key} (${description}):\x1b[m\n${result.trim()}`);
        } catch (err) {
            if (required) {
                console.error(`\x1b[91m檢查 ${key} 時發生錯誤，此項目是必需的\x1b[m`);
                process.exit(1);
            }
        }
    }
    console.log("\x1b[92mOK\x1b[m");
}
