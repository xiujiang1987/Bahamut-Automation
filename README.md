![Bahamut Automation Preview.png](https://github.com/JacobLinCool/Bahamut-Automation/raw/main/Bahamut%20Automation%20Preview.png)

# Bahamut Automation Action
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJacobLinCool%2FBahamut-Automation.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FJacobLinCool%2FBahamut-Automation?ref=badge_shield)

巴哈姆特自動化！

自動簽到、自動動畫瘋答題、自動抽抽樂，以及其他更多！

## 特色
### 不需要任何硬體
好吧，其實也不完全是這樣啦。應該說是不需要任何「你的」硬體，程式使用 GitHub Action 在雲端自動執行。

> 不過如果你要在自己電腦上執行也是可以喔，觀察一下 `test.js`！

### 快速設定立刻開始
不用 5 分鐘就可以完成所有設置！節省未來數百倍甚至數千倍的時間！

> 詳情請至[使用方法](#使用方法)查看

### 完整公開及免費使用
所有程式碼皆完整公開於 GitHub 上，所有會執行到的程式就是那些。

這個工具本來是我自己要用的，既然都寫了，就拿出來給大家一起用！不過如果你要捐款我也是 OK 的喔，等等，好像沒有捐款按鈕？那就給個 star 或幫忙一起優化吧！

### 不影響巴哈姆特收益
可能大部分人不會在意這點吧？但這個工具理論上是可以創造站方與使用者雙贏的。
因為自動化程式還是以正常程序把廣告看完了，所以巴哈還是會收到廣告費，應該吧？

## 功能
### 自動簽到
- 自動執行每日簽到
- 自動觀看廣告以獲得雙倍獎勵
- 自動公會簽到

### 自動回答動畫瘋問題
- 自動抓取解答以回答當日問題
  - 解答自 blackXblue 小屋抓取

### 自動福利社抽抽樂
- 自動檢測抽抽樂數量
- 自動觀看廣告獲得免費抽抽樂機會
- 自動檢測是否需要答題，如需要，自動答題

### 自動蓋樓（回文）
- 自動於指定文章回覆
- 支援複數文章
- 支援巴哈 BBCode（支援圖片連結等）
- 支援時間變數（以執行時的時間替換）

### 自動勇者大聲說
- 自動發佈勇者大聲說
- 支援隨機挑遠內容
- 支援時間變數（以執行時的時間替換）

### Telegram 通知
- 以 Telegram 通知執行狀況

### Discord 通知
- 以 Discord 通知執行狀況

## 使用方法
### 使用 GitHub Action （建議）
[**詳細的教學**](https://jacoblincool.github.io/Bahamut-Automation/tutorial)

1. [Fork Template](https://github.com/JacobLinCool/Bahamut-Automation-Template/fork) ([使用 Template 來建立 Repository 也行](https://github.com/JacobLinCool/Bahamut-Automation-Template/generate))，建議使用 **Public** Repository 可以無上限使用，GitHub 有給 Private Repository 每月 2000 分鐘執行限制
2. 於新建立的 Repo 的 Settings > Secrets 分頁新增一個名為`secrets` 的 `Secret`，修改以下程式碼後貼上作為 `secrets` 的值
```json
{
  "username": "你的巴哈帳號",
  "password": "你的巴哈密碼",
  "twofa": "你的巴哈兩步驟驗證種子碼 (非必要)",
  "gh_pat": "GitHub Personal Access Token (非必要)",
  "tg_id": "Telegram 訊息通道 ID (非必要)",
  "dc_url": "Discord Webhook 網址 (非必要)"
}
```
`gh_pat` 是 `report` 模組必要參數；`tg_id` 是 `telegram` 模組必要參數；`dc_url` 是 `discord` 模組必要參數

3. 完成，詳細內容可以看看新建立的 Repo 的 README.md 及[模組說明文件](./src/modules#readme)

*注意：新辦帳號只執行巴哈自動化的情況，可能被 GitHub 視為濫用資源（lottery 模組執行時間可能要近 1 小時）*

> 如果遇到問題歡迎[發 Issue 詢問](https://github.com/JacobLinCool/Bahamut-Automation/issues/new)喔

### 在自己電腦上執行
1. 安裝 `Node.js` v14+
2. 下載此 Repository
3. 觀察 `test.js`
4. 以 `Node.js` 執行 `test.js`

```shell
$ node test.js 巴哈帳號 巴哈密碼
```

## 輸入參數

| 參數       | 預設值                                                                        | 說明      | 必要 |
| ---------- | --------------------------------------------------------------------------- | --------- | ---- |
| modules    | `"login,ad_handler,sign,report,answer,report,lottery,report,logout,report"` | 使用的模組 | 非必要 |
| parameters | `"{}"`                                                                      | 帶入的參數 | 非必要 |
| secrets    | `"{}"`                                                                      | 帶入的參數 | 非必要 |

全部都是非必要參數，但你什麼都不放就什麼都不會發生，合理吧？

## 模組
[模組說明文件](./src/modules#readme)

## 技術細節
所有程式碼都是使用 `JavaScript` 編寫，以 `Puppeteer` 模擬人的操作，使用 `Node.js` 執行，並以 `GitHub Action` 的形式發佈。

可以於 `src` 資料夾中查看所有核心程式碼。

## 聲明
我不能保證程式一定會如期執行，也不能保證程式會成功執行，有時 GitHub 會自己吃掉。

自 v0.6.7 版本開始，使用 [countapi.xyz](https://countapi.xyz/) 計數器匿名累積使用次數，方便估算成效，如有疑慮請不要使用本程式。

本程式仰賴部分 NPM 外部程式庫，如果發生安全問題，由使用者自行承擔，如有疑慮請不要使用本程式。

如果你執行這個程式，代表你必須自負所有風險，如有疑慮請不要使用本程式。

如果你發現什麼 Bug 之類的東西（尤其是安全問題），或是有新的想法，歡迎[到 Action 的 Repo 發 Issue](https://github.com/JacobLinCool/Bahamut-Automation/issues)。


## License Check
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJacobLinCool%2FBahamut-Automation.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FJacobLinCool%2FBahamut-Automation?ref=badge_large)
