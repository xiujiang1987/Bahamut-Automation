# Modules
各模組的介紹

## login
登入巴哈姆特的模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： username, password
- 可選參數： 無

## logout
登出巴哈姆特的模組，需先執行 login 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## ad_handler
用來處理 Google AD 的模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## sign
巴哈簽到的模組，需先執行 login 模組，雙倍獎勵需先執行 ad_handler 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## answer
動畫瘋答題的模組，需先執行 login 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無


## lottery
勇者福利社抽獎的模組，需先執行 login 及 ad_handler 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

**注意事項：使用前請先自己抽一次，填寫一次收件人資料並勾選「記住收件人資料」**

## report
產生執行報告並發到 Issue 的模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： gh_pat
- 可選參數： report_title, report_labels, report_ignore


## telegram
串接 telegram 的模組，[詳細說明在 telegram 資料夾內](./telegram)
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： tg_id
- 可選參數： tg_ignore

## guild
公會簽到的模組，需先執行 login 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： 無
- 可選參數： 無

## sayloud
勇者大聲說的模組，需先執行 login 模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： sayloud
- 可選參數： 無

## module
說明模組格式的的模組
- 作者： [JacobLinCool](https://github.com/JacobLinCool)
- 必要參數： module_needs_this_parameter
- 可選參數： optional_parameter

