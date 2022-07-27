import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { BahamutAutomationConfig } from "./types";

/**
 * Default config
 */
export const default_config: BahamutAutomationConfig = {
    shared: {},
    modules: {},
    browser: {
        type: "firefox",
        headless: true,
        firefoxUserPrefs: {
            "dom.webaudio.enabled": false,
            "media.volume_scale": 0,
            "media.default_volume": 0,
        },
    },
};

/**
 * Find config file in a given directory.
 * config.yaml, config.yml, config.json, config.js, config.mjs, config.cjs
 * @param dir The directory to search.
 * @return The absolute path of the config file.
 */
export function find_config(dir: string): string {
    dir = path.resolve(dir);

    const exts = [".yaml", ".yml", ".json", ".js", ".mjs", ".cjs"];
    const files = fs
        .readdirSync(dir)
        .filter(
            (file) =>
                file.toLowerCase().startsWith("config") &&
                exts.some((ext) => file.toLowerCase().endsWith(ext)),
        );

    if (files.length === 0) {
        throw new Error(`在 ${dir} 找不到設定檔`);
    }

    return path.resolve(dir, files[0]);
}

/**
 * Parse config file.
 * @param config_path The absolute path of the config file.
 * @return The config object.
 */
export async function parse_config(config_path: string): Promise<BahamutAutomationConfig> {
    let config: Partial<BahamutAutomationConfig>;

    switch (path.extname(config_path)) {
        case ".yaml":
        case ".yml":
            config = yaml.load(fs.readFileSync(config_path, "utf8"));
            break;
        case ".json":
            config = JSON.parse(fs.readFileSync(config_path, "utf8"));
            break;
        case ".js":
        case ".mjs":
            config = (await import(config_path)).default;
            break;
        case ".cjs":
            config = require(config_path);
            break;
        default:
            throw new Error("不支援的設定檔格式");
    }

    return { ...default_config, ...config };
}
