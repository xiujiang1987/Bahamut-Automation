import { Page } from "playwright-core";
import { VERBOSE } from "../constants";

export async function wait_for_cloudflare(page: Page) {
    const spiiner = await page.$("#cf-spinner-please-wait");

    if (spiiner === null) {
        return;
    }

    const blocked = await page.isVisible("#cf-spinner-please-wait");

    if (VERBOSE) {
        console.log("Cloudflare blocked:", blocked);
    }

    if (blocked) {
        await page.waitForNavigation({ timeout: 10_000 }).catch(() => {
            throw new Error("Cloudflare blocked (auto navigation timeout)");
        });
    }
}
