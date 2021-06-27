# Bahamut Automation Action
巴哈姆特自動化！

## 使用方法

1. 在 GitHub 上建立一個新的 Repository
2. 於 Repo 的 Settings 頁面中的 Secrets 分頁新增兩個 `Secret`
   1. `USERNAME`: 你的巴哈姆特帳號
   2. `PASSWORD`: 你的巴哈姆特密碼
3. 在 Repo Root 建立 `.github` 資料夾
4. 在 `.github` 資料夾中建立 `workflows` 資料夾
5. 在 `workflows` 資料夾中建立 `automation.yml` 並在其中貼上以下程式碼

```
name: 自動化

on:
  schedule:
    - cron: "0 17 * * *"
  workflow_dispatch:

jobs:
  automation:
    name: 自動化
    runs-on: macos-latest
    steps:
      - name: Bahamut Automation
        uses: JacobLinCool/Bahamut-Automation@v0.1
        with:
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          auto_sign: "true"
          auto_sign_double: "true"
          auto_draw: "true"
          auto_answer_anime: "true"
```

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
