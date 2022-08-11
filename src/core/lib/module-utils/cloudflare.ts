import { Page } from "playwright-core";
import { VERBOSE } from "../constants.js";

export async function wait_for_cloudflare(page: Page, tried = 0) {
    if (tried > 5) {
        throw new Error("等待 Cloudflare 失敗");
    }

    const blocked = await page.isVisible("#cf-spinner-please-wait");

    if (VERBOSE) {
        console.log("Cloudflare blocked:", blocked);
    }

    if (blocked) {
        await page.waitForTimeout(10_000);
        await wait_for_cloudflare(page, tried + 1);
    }
}
