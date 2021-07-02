# Bahamut Automation Action
巴哈姆特自動化！

使用 GitHub 來幫你自動簽到、自動回答動畫瘋問題、自動抽抽樂！

## 功能介紹
本工具是以節省你的時間為目的。

### 自動簽到
- 自動檢測簽到狀態
- 自動觀看廣告以獲得雙倍獎勵

### 自動回答動畫瘋問題
- 自動抓取解答以回答當日問題

### 自動福利社抽抽樂
- 自動檢測即時抽抽樂數量
- 自動檢測抽抽樂免費次數是否已用完
- 自動檢測是否需要答題，如需要，自動答題
- 自動觀看廣告以獲得抽抽樂機會

## 使用方法

1. [使用 Template 來建立 Repository](https://github.com/JacobLinCool/Bahamut-Automation-Template/generate)
2. 於新建立的 Repo 的 Settings > Secrets 分頁新增兩個 `Secret`
   1. `USERNAME`: 你的巴哈姆特帳號
   2. `PASSWORD`: 你的巴哈姆特密碼
3. 完成，詳細內容可以看看新建立的 Repo 的 README.md

## 輸入參數

### `username`

**Required** 巴哈姆特帳號 (建議使用 Secret)

預設：`""`

### `password`

**Required** 巴哈姆特密碼 (建議使用 Secret)

預設：`""`

### `auto_sign`

**Required** 啟用自動簽到

預設：`false`

### `auto_sign_double`

**Required** 啟用自動觀看雙倍簽到獎勵廣告

預設：`false`

### `auto_draw`

**Required** 啟用福利社自動抽抽樂

預設：`false`

### `auto_answer_anime`

**Required** 啟用動畫瘋自動答題

預設：`false`

### `parallel`

**Optional** 啟用平行處理（縮短執行時間，但可能會出問題，目前建議不要使用）

預設：`false`

### `gh_pat`

**Optional** GitHub Personal Access Token，提供會啟用 Issue Report (建議使用 Secret)

預設：`""`

## 技術細節
所有程式碼都是使用 `JavaScript` 編寫，並以 `Node.js` 執行，以 `GitHub Action` 的形式發佈。

可以於 `src` 資料夾中查看所有核心程式碼。

## 聲明
我不能保證程式一定會如期執行，也不能保證程式會成功執行，有時 GitHub 會自己吃掉。

如果你發現什麼 Bug 之類的東西，或是有新的想法，歡迎[到 Action 的 Repo 發 Issue](https://github.com/JacobLinCool/Bahamut-Automation/issues)。
