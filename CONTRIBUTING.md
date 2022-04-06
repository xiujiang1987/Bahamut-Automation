# 開發教學與開發須知

先謝謝所有想對於想要對此專案作出貢獻的人。

對於這個專案，你可以協助加強主程式、加強現有模組，或撰寫新模組。

你不只可以直接對這個專案貢獻，也可以自己開發第三方模組給自己及社群中的人用。

## 環境配置

1. 在 local 安裝 Node.js 16 以上版本
2. 在 local 安裝 PNPM (`npm i -g pnpm`)
3. Fork 這個專案
4. Pull 你的 Fork 到 local
5. 在專案目錄執行 `pnpm i && pnpm build` 安裝 dependencies 及建構程式
6. 完成，現在可以使用 `pnpm start` 試試看！

或者，你也可以用 Gitpod 線上作業，省去 `1.` 和 `2.`：

[![Open in Gitpod][gitpod-svg]][gitpod-link]

## 相關知識

核心本身是用 `TypeScript` 撰寫的，但可以用 `JavaScript` 自行撰寫第三方模組。

開發中你可能會需要 [Playwright 的文件](https://playwright.dev/docs/api/class-playwright) ，建議先對於其中的內容認識一下（主要是 `Page` 以下的層級）。

關於 module 的載入方式，其實並不複雜，可以查看 [`src/core/automation.ts`](src/core/automation.ts)。

而關於 module 的格式，可以參考 [`src/modules/module_ts.ts`](src/modules/module_ts.ts) 或 [`src/modules/module.js`](src/modules/module.js)。

如有不清楚的地方，歡迎至 [Discussions](https://github.com/JacobLinCool/Bahamut-Automation/discussions) 或發 Issue 詢問，謝謝。

## 開發須知

如果 reviewer 忘記把你加進 all contributors 的列表中，請提醒他或自己加。

[All Contributors CLI][all-contributors-cli-usage]

[gitpod-svg]: https://gitpod.io/button/open-in-gitpod.svg
[gitpod-link]: https://gitpod.io/#https://github.com/JacobLinCool/Bahamut-Automation
[all-contributors-cli-usage]: https://allcontributors.org/docs/en/cli/usage