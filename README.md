# Bahamut Automation Action
巴哈姆特自動化！

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
