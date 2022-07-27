import type { Page } from "playwright-core";

export const locations = {
    home: "https://www.gamer.com.tw/",
    login: "https://user.gamer.com.tw/login.php",
    anime: "https://ani.gamer.com.tw/",
    fuli: "https://fuli.gamer.com.tw/",
    user: "https://home.gamer.com.tw/homeindex.php?owner=<owner>",
} as const;

export function goto(page: Page, location: keyof typeof locations, ...args: string[]) {
    let url: string = locations[location];
    if (/<\w+>/.test(url)) {
        url = url.replace(/<(\w+)>/g, (_, key) => args.shift());
    }
    return page.goto(url);
}

export default goto;
