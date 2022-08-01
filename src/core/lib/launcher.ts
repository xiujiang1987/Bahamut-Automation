import fs from "node:fs";
import path from "node:path";
import is_docker from "is-docker";
import playwright from "playwright-core";
import { BRWOSER_TYPES, VERBOSE } from "./constants.js";
import { booleanify, get_root } from "./utils.js";

export async function launch(
    type: typeof BRWOSER_TYPES[number] = "firefox",
    options: playwright.LaunchOptions = {},
): Promise<{ browser: playwright.Browser; context: playwright.BrowserContext }> {
    if (type === "chromium" && !options.args?.includes("--mute-audio")) {
        options.args = [...(options.args || []), "--mute-audio"];
    }

    if (!is_docker() && !options.executablePath && type === "chromium") {
        options.executablePath = find_chrome();
    }

    if (options.headless) {
        options.headless = booleanify(options.headless);
    }

    if (VERBOSE) {
        console.log(`launching ${type} from ${options.executablePath || "default executable"}`);
        console.log(`with args ${options.args?.join(" ") || "none"}`);
    }

    const browser = await playwright[type].launch(options);
    const context = await browser.newContext();

    if (VERBOSE) {
        const test_page = await context.newPage();
        const version = await test_page.evaluate(() => navigator.userAgent);
        console.log(`launched ${type} (${version})`);
        await test_page.close();
    }

    return { browser, context };
}

function find_chrome(): string {
    const chrome_path = process.env.CHROME_PATH;
    if (chrome_path) {
        return chrome_path;
    }

    const candidates: Partial<Record<typeof process.platform, string[]>> = {
        win32: [
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\chrome.exe",
            "C:\\Program Files\\Google\\Chrome\\chrome.exe",
        ],
        darwin: [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        ],
        linux: [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome-unstable",
            "/usr/bin/google-chrome-beta",
            "/usr/bin/google-chrome-dev",
        ],
    };

    let location: string;
    for (const candidate of candidates[process.platform]) {
        if (fs.existsSync(candidate)) {
            location = candidate;
            break;
        }
    }

    if (!location) {
        throw new Error("找不到 Chrome 的位置");
    }

    return location;
}

function find_firefox(): string {
    const dirs = fs
        .readdirSync(path.resolve(get_root(), "node_modules", "playwright-core", ".local-browsers"))
        .filter((x) => x.startsWith("firefox-"))
        .reverse();

    if (!dirs.length) {
        throw new Error("找不到 Firefox 的位置，請先 install firefox");
    }

    const dir = path.resolve(
        get_root(),
        "node_modules",
        "playwright-core",
        ".local-browsers",
        dirs[0],
    );

    if (process.platform === "win32") {
        return path.resolve(dir, "firefox", "firefox.exe");
    } else if (process.platform === "darwin") {
        return path.resolve(dir, "firefox", "Nightly.app", "Contents", "MacOS", "firefox");
    } else if (process.platform === "linux") {
        return path.resolve(dir, "firefox", "firefox");
    }

    throw new Error("不支援的平台");
}

function find_webkit(): string {
    const dirs = fs
        .readdirSync(path.resolve(get_root(), "node_modules", "playwright-core", ".local-browsers"))
        .filter((x) => x.startsWith("webkit-"))
        .reverse();

    if (!dirs.length) {
        throw new Error("找不到 WebKit 的位置，請先 install webkit");
    }

    const dir = path.resolve(
        get_root(),
        "node_modules",
        "playwright-core",
        ".local-browsers",
        dirs[0],
    );

    if (process.platform === "win32") {
        return path.resolve(dir, "Playwright.exe");
    } else if (process.platform === "darwin") {
        return path.resolve(dir, "pw_run.sh");
    } else if (process.platform === "linux") {
        return path.resolve(dir, "pw_run.sh");
    }

    throw new Error("不支援的平台");
}
