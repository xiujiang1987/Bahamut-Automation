import fs from "node:fs";
import path from "node:path";

export async function sleep(ms: number): Promise<void> {
    new Promise((resolve) => setTimeout(resolve, ms));
}

export function get_version(dirname: string): string {
    try {
        let depth = 5;
        let package_path = path.resolve(dirname, "package.json");
        while (!fs.existsSync(package_path) && depth-- > 0) {
            package_path = path.resolve(path.dirname(package_path), "..", "package.json");
        }
        const file = fs.readFileSync(package_path, "utf8");
        const json = JSON.parse(file);
        return json.version;
    } catch (err) {
        return "";
    }
}

export function second_to_time(second: number): string {
    const hour = Math.floor(second / 3600);
    const minute = Math.floor((second - hour * 3600) / 60);
    const second_left = second - hour * 3600 - minute * 60;

    return `${hour} 小時 ${minute} 分 ${second_left} 秒`;
}

export function deep_merge(target: any, source: any): void {
    for (const key in source) {
        if (!source.hasOwnProperty(key)) {
            continue;
        }

        target[key] =
            typeof source[key] === "object" && typeof target[key] === "object"
                ? deep_merge(target[key], source[key])
                : source[key];
    }
}

export function get_root() {
    return path.resolve(__dirname, "..", "..", "..");
}

export function booleanify(raw: string | number | boolean): boolean {
    return typeof raw === "boolean"
        ? raw
        : typeof raw === "number"
        ? raw !== 0
        : ["true", "1", "on", "yes"].includes(raw.slice(0, 4).toLowerCase().trim());
}
