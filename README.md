# Bahamut Automation Action
巴哈姆特自動化！

使用 GitHub 來幫你自動簽到、自動回答動畫瘋問題、自動抽抽樂！

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

**Optional** 啟用平行處理（縮短執行時間，但可能會出問題）

預設：`false`

### `gh_pat`

**Optional** GitHub Personal Access Token，提供會啟用 Issuer（測試中）

預設：`""`

## 聲明
我不能保證程式一定會如期執行，也不能保證程式會成功執行，有時 GitHub 會自己吃掉。

如果你發現什麼 Bug 之類的東西，或是有新的想法，歡迎[到 Action 的 Repo 發 Issue](https://github.com/JacobLinCool/Bahamut-Automation/issues)。