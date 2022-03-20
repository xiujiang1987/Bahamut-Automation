# Modules

各模組的介紹

## ad_handler

用來處理 Google AD 的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## answer

動畫瘋答題的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： max_attempts

## builder

蓋樓（回文）模組，[詳細說明在 builder 資料夾內](./builder#readme)

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： posts
- 可選參數： 無

## del_mail

刪除站內信的模組，[詳細說明在 del_mail 資料夾內](./del_mail#readme)

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： match
- 可選參數： 無

## discord

串接 discord 的模組，[詳細說明在 discrd 資料夾內](./discord#readme)

- 作者： [cow03haha](https://github.com/cow03haha)
- 必要參數： webhook
- 可選參數： 無

## guild

公會簽到的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： max_attempts

## issue

將報告發到 GitHub Issue 的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： pat
- 可選參數： labels

## line_notify

串接 Line Notify 的模組，[詳細說明在 line_notify 資料夾內](./line_notify#readme)

- 作者： [dxball](https://github.com/dxball)
- 必要參數： token
- 可選參數： 無

## login

登入巴哈姆特的模組

_目前作為 [`login_v2`](#login_v2) 的別名使用_

## login_v2

略過 recaptcha 登入巴哈姆特的模組

- 作者： [dxball](https://github.com/dxball)
- 必要參數： username, password
- 可選參數： twofa, max_attempts

## logout

登出巴哈姆特的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## lottery

勇者福利社抽獎的模組，需先執行 ad_handler 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： max_attempts, max_parallel

> **注意事項：使用前請先自己抽一次，填寫一次收件人資料並勾選「記住收件人資料」**

## report

產生執行報告的模組，在使用發送報告的模組前須先執行它

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： report_title, report_ignore

## sayloud

勇者大聲說的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： sayloud
- 可選參數： 無

## sign

巴哈簽到的模組，雙倍獎勵需先執行 ad_handler 模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： double_max_attempts

## telegram

串接 telegram 的模組，[詳細說明在 telegram 資料夾內](./telegram#readme)

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： channel
- 可選參數： 無

## test

測試用的模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## utils

通用函式庫

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## module

範例模組

- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無
