import { Module } from "bahamut-automation";
import type { ElementHandle, Page } from "playwright-core";

interface MatchRule {
    title?: string;
    sender?: string;
    before?: string;
    after?: string;
}

interface Mail {
    id: string;
    sender: string;
    title: string;
    time: Date;
    checkbox: ElementHandle<HTMLInputElement>;
}

export default {
name: "清除站內信",
  description: "依給定 pattern 清除站內信",
  async run({ page, shared, params, logger }) {
    if (!shared.flags.logged)
      throw new Error("使用者未登入");

    const repeatCount = getrepeatcount(params) || 1; 

    for (let repeat = 0; repeat < repeatCount; repeat++) {
      logger.log(`開始執行第 ${repeat + 1} 次執行`);

      const del_mail_match = params.match;
      if (del_mail_match.length < 1)
        return { success: false };
      await Promise.all([
        page.waitForResponse("https://mailbox.gamer.com.tw/ajax/inboxList.php"),
        page.goto("https://mailbox.gamer.com.tw/?l=1")
      ]);
      logger.log("正在搜集站內信...");
      let mails = filtered_mails(await get_mails(page), del_mail_match).map((mail) => mail.id);
      while ((await page.$$(".next")).length > 0 && mails.length < 1e4) {
        logger.log(`已搜集 ${mails.length} 封符合條件的站內信`);
        await Promise.all([
          page.waitForResponse("https://mailbox.gamer.com.tw/ajax/inboxList.php"),
          page.click(".next")
        ]);
        mails = [
          ...mails,
          ...filtered_mails(await get_mails(page), del_mail_match).map((mail) => mail.id)
        ];
      }
      logger.log(`已搜集 ${mails.length} 封符合條件的站內信`);
      const csrf = await (await page.$("#delFrm input[name='csrfToken']")).getAttribute("value");
      for (let i = 0; i < mails.length; i += 100) {
        logger.log(`正在刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信...`);
        const res = await delete_mails(page, mails.slice(i, i + 100), csrf);
        if (res.code === 0) {
          logger.log(`已成功刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信`);
        } else {
          logger.error(
            `刪除第 ${i + 1} 到 ${Math.min(i + 100, mails.length)} 封站內信失敗 (${
                        res.code
                    })`
          );
        }
      }

      logger.log(`第 ${repeat + 1} 次執行完成`);
    }
  }
};
async function get_mails(page: Page): Promise<Mail[]> {
    const Mails: Mail[] = [];
    const mails = (await page.$$(".readR, .readU")) as ElementHandle<HTMLElement>[];

    for (const mail of mails) {
        const sender = (await (await mail.$(".ML-tb1B")).textContent()).trim();
        const title = (await (await mail.$(".mailTitle")).textContent()).trim();
        const time = new Date((await (await mail.$("[nowrap='nowrap']")).textContent()).trim());
        const checkbox = (await mail.$(
            "input[type='checkbox']",
        )) as ElementHandle<HTMLInputElement>;
        const id = await checkbox.getAttribute("value");

        Mails.push({ id, sender, title, time, checkbox });
    }

    return Mails;
}

function filtered_mails(mails: Mail[], matches: MatchRule[]): Mail[] {
    const filtered: Mail[] = [];

    for (const mail of mails) {
        const { sender, title, time } = mail;

        for (const match of matches) {
            let passed = true;
            const {
                title: title_match,
                sender: sender_match,
                before: before_match,
                after: after_match,
            } = match;

            if (title_match && !title.includes(title_match)) passed = false;
            if (sender_match && !sender.includes(sender_match)) passed = false;
            if (before_match && time.getTime() > new Date(before_match).getTime()) passed = false;
            if (after_match && time.getTime() < new Date(after_match).getTime()) passed = false;

            if (passed) {
                filtered.push(mail);
                break;
            }
        }
    }

    return filtered;
}

async function delete_mails(page: Page, mails: string[], csrf: string) {
    return page.evaluate(
        async ({ mails, csrf }) => {
            const res = await fetch("https://mailbox.gamer.com.tw/ajax/inboxDel.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `csrfToken=${csrf}${mails.map((id) => `&del%5B%5D=${id}`).join("")}`,
            });
            return await res.json();
        },
        { mails, csrf },
    );
}
