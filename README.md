![Bahamut Automation Preview.png](Bahamut Automation Preview.png)

# Bahamut Automation Action
巴哈姆特自動化！

自動簽到、自動回答動畫瘋問題、自動抽抽樂！

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

### 自動回答動畫瘋問題
- 自動抓取解答以回答當日問題
  - 解答自 blackXblue 小屋抓取

### 自動福利社抽抽樂
- 自動檢測抽抽樂數量
- 自動觀看廣告獲得免費抽抽樂機會
- 自動檢測是否需要答題，如需要，自動答題

## 使用方法
### 使用 GitHub Action （建議）
1. [使用 Template 來建立 Repository](https://github.com/JacobLinCool/Bahamut-Automation-Template/generate)，建議建立 **Public** Repository 可以無上限使用，GitHub 有給 Private Repository 每月 2000 分鐘執行限制
2. 於新建立的 Repo 的 Settings > Secrets 分頁新增兩個 `Secret`
   1. `USERNAME`: 你的巴哈姆特帳號
   2. `PASSWORD`: 你的巴哈姆特密碼
3. 完成，詳細內容可以看看新建立的 Repo 的 README.md

> 如果遇到問題歡迎[發 Issue 詢問](https://github.com/JacobLinCool/Bahamut-Automation/issues/new)喔

### 在自己電腦上執行
1. 安裝 `Node.js` v14+
2. 下載此 Repository
3. 觀察 `test.js`
4. 以 `Node.js` 執行 `test.js`

```shell
$ node test.js 巴哈帳號 巴哈密碼 1 1 1 1 true

# 前四個 1 分別是 自動登入, 雙倍簽到, 抽抽樂, 動畫瘋答題
# 最後的 true 是表示在 Headless 模式執行，改成 false 可以看見瀏覽器行為，方便偵錯
```

## 輸入參數

| 參數                  | 預設值    | 說明         | 必要 |
| -------------------- | -------- | ------------| ---- |
| username             | `""`     | 巴哈姆特帳號 (建議使用 Secret) | 必要 |
| password             | `""`     | 巴哈姆特密碼 (建議使用 Secret) | 必要 |
| auto_sign            | `false`  | 啟用自動簽到                  | 必要 |
| auto_sign_double     | `false`  | 啟用自動觀看雙倍簽到獎勵廣告    | 必要 |
| auto_draw            | `false`  | 啟用福利社自動抽抽樂           | 必要 |
| auto_answer_anime    | `false`  | 啟用動畫瘋自動答題             | 必要 |
| parallel             | `false`  | 啟用平行處理（縮短執行時間，但可能會出問題，目前建議不要使用） | 選用 |
| gh_pat               | `""`     | GitHub Personal Access Token，提供會啟用 Issue Report (建議使用 Secret) | 選用 |


## 技術細節
所有程式碼都是使用 `JavaScript` 編寫，並以 `Node.js` 執行，以 `GitHub Action` 的形式發佈。

可以於 `src` 資料夾中查看所有核心程式碼。

## 聲明
我不能保證程式一定會如期執行，也不能保證程式會成功執行，有時 GitHub 會自己吃掉。

如果你發現什麼 Bug 之類的東西，或是有新的想法，歡迎[到 Action 的 Repo 發 Issue](https://github.com/JacobLinCool/Bahamut-Automation/issues)。
