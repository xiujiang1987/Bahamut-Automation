import type { Page } from "playwright-core";
import goto from "./goto.js";

export interface User {
    username: string;
    nickname: string;
    title: string;
    level: number;
    balance: number;
    gp: number;
    sponsored: number;
    registered_at: Date;
    last_login_at: Date;
    verified: boolean;
}

export async function user(page: Page, username: string): Promise<User> {
    const context = await page.context().browser().newContext();
    const private_page = await context.newPage();
    await goto(private_page, "user", username);

    const block_top = await private_page.evaluate(() => {
        const block = document.querySelector<HTMLUListElement>(
            "#BH-slave > div.BH-rbox.MSG-list2 > ul.MSG-mydata1",
        );
        const nickname = block.children[1].textContent.replace("暱稱：", "").trim();
        const title = block.children[2].textContent.replace("稱號：", "").trim();
        const level = parseInt(block.children[3].textContent.replace(/\D/g, ""));
        const balance = parseInt(block.children[4].textContent.replace(/\D/g, ""));
        const gp = parseInt(block.children[5].textContent.replace(/\D/g, ""));
        const sponsored = parseInt(block.children[6].textContent.replace(/\D/g, ""));
        return { nickname, title, level, balance, gp, sponsored };
    });

    const block_bottom = await private_page.evaluate(() => {
        const block = document.querySelector<HTMLUListElement>(
            "#BH-slave > div.BH-rbox.BH-list1 > ul",
        );
        const verified = block.children[2].textContent.includes("手機認證：有");
        const registered_at = new Date(block.children[3].textContent.replace(/[^\d-]/g, ""));
        const last_login_at = new Date(block.children[5].textContent.replace(/[^\d-]/g, ""));
        return { verified, registered_at, last_login_at };
    });

    await private_page.close();
    await context.close();

    return { username, ...block_top, ...block_bottom };
}

export default user;
