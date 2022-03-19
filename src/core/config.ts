import fs from "node:fs";
import path from "node:path";

/**
 * Search config in a given directory.
 * config.yaml, config.yml, config.json, config.js
 * @param dir
 * @return The absolute path of the config file.
 */
export function search_config(dir: string): string {
    const exts = [".yaml", ".yml", ".json"];
    const files = fs
        .readdirSync(dir)
        .filter(
            (file) =>
                file.toLowerCase().startsWith("config") &&
                exts.some((ext) => file.toLowerCase().endsWith(ext)),
        );
    return files.length ? path.resolve(dir, files[0]) : null;
}
