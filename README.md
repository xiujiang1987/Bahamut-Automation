
<br />
<div align="center">
  
[![Banner][banner-img]][gitlab-url]

### 巴哈姆特自動化！

自動簽到、自動動畫瘋答題、自動抽抽樂，以及其他更多！

[![Contributors][contributors-shield]][contributors-url]
[![Pulls][pull-shield]][pull-url]
[![Version][version-shield]][version-url]
[![MIT License][license-shield]][license-url]

[**>> 開始使用 <<**](#使用方法)

[遇到問題][discussion-qa] ·
[想要新功能][discussion-idea] ·
[自製模組](./src/modules/module.js)

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>目錄</summary>

  1. [特色](#特色)
     - [不需要任何硬體](#不需要任何硬體)
     - [快速設定立刻開始](#快速設定立刻開始)
     - [完整公開及免費使用](#完整公開及免費使用)
     - [不影響巴哈姆特收益](#不影響巴哈姆特收益)
  2. [功能](#功能)
     - [簽到](#簽到)
     - [回答動畫瘋問題](#回答動畫瘋問題)
     - [福利社抽抽樂](#福利社抽抽樂)
     - [蓋樓（回文）](#蓋樓（回文）)
     - [勇者大聲說](#勇者大聲說)
     - [整理站內信](#整理站內信)
     - [多平台通知](#多平台通知)
  3. [使用方法](#使用方法)
     - [命令列工具 （💻）](#use-cli)
     - [已編譯的執行檔 （💻）](#use-binary)
     - [Docker （🐳）](#use-docker)
     - [其他雲端平台 （☁️）](#use-other-platforms)
  4. [為此專案貢獻](#為此專案貢獻)
     - [如何開始？](#如何開始)
     - [貢獻者們](#貢獻者們)

</details>

## 特色

### 不需要任何硬體

好吧，其實也不完全是這樣啦。應該說是不需要任何「你的」硬體，程式提供 Docker Image，你可以使用其在許多雲端環境自動執行。

> 不過如果你要在自己電腦上執行也是可以喔，查看[使用方法](#使用方法)！

### 快速設定立刻開始

不用 5 分鐘就可以完成所有設置！節省未來數百倍甚至數千倍的時間！

> 詳情請至[使用方法](#使用方法)查看

### 完整公開及免費使用

所有程式碼皆依 MIT 授權開源於 GitLab 上，所有會執行到的程式就是那些。

這個工具本來是我自己要用的，既然都寫了，就拿出來給大家一起用！不過如果你要捐款我也是 OK 的喔，等等，好像沒有捐款按鈕？那就給個 star 或幫忙一起優化吧！

### 不影響巴哈姆特收益

可能大部分人不會在意這點吧？但這個工具理論上是可以創造站方與使用者雙贏的。
因為自動化程式還是以正常程序把廣告看完了，所以巴哈還是會收到廣告費，應該吧？

## 功能

所有的功能皆由「模組」實現，內建的模組大致有以下功能：

### 簽到

- 執行每日簽到
- 觀看廣告以獲得雙倍獎勵
- 公會簽到

### 回答動畫瘋問題

- 抓取解答回答當日問題

> 解答自 [blackXblue 小屋](https://home.gamer.com.tw/homeindex.php?owner=blackxblue)抓取

### 福利社抽抽樂

- 觀看廣告獲得免費抽抽樂機會
- 檢測是否需要答題，如需要，自動答題

### 蓋樓（回文）

- 於指定文章回覆
- 支援複數文章
- 支援巴哈 BBCode（支援圖片連結等）
- 支援時間變數模板（以執行時的時間動態替換）

### 勇者大聲說

- 發佈勇者大聲說
- 支援隨機挑選內容
- 支援時間變數模板（以執行時的時間動態替換）

### 整理站內信

- 依給定規則刪除站內信

### 多平台通知

- 以 Telegram 通知執行狀況
- 以 Discord 通知執行狀況
- 以 Line Notify 通知執行狀況

> 補充說明：如上所述，這個工具本來就是我自己要用的，所以如果是我比較沒在用的模組，我自己就比較不會有熱忱去維護（當然，對於任何 Pull (Merge) Request 我都很歡迎）
> 再來，我是有設計自製模組的插件系統的，如果是非通用模組，可以考慮自己寫寫看。
> 最後，我不希望有人拿這個來做壞事，尤其是對使用者社群及巴哈生態，請保持善良的心。

## 使用方法

有各種使用方法，如果遇到問題歡迎[詢問][discussion-qa]喔！

<a id="use-cli"></a>

### 命令列工具 （💻）

1. 安裝 `Node.js` v16+
2. 下載 `example/config.yml` 並修改設定
3. 執行 `npx bahamut-automation` 試試看

<a id="use-binary"></a>

### 已編譯的執行檔 （💻）

> 不建議，其實就是把 `Node.js` 跟命令列工具包在一起而已

1. 下載 `example/config.yml` 並修改設定
2. 於 [`binary` branch](https://gitlab.com/jacoblincool/bahamut-automation/tree/binary) 中下載已編譯的程式
3. 然後執行該程式

***已編譯的執行檔有可能會被防毒軟體擋掉。***

***已編譯的執行檔是使用 GitLab CI 從 main branch 的原始碼編譯的，相關編譯方法可以在 main branch 中查看。但搞不好 GitLab CI 出了什麼問題，沒有人知道。***

***總而言之，如果你下載並使用這些程式，代表你同意自行承擔所有責任，包括但不限於使用程式導致的任何損失。***

<a id="use-docker"></a>

### Docker （🐳）

1. 下載 `example/config.yml` 並修改設定
2. 執行以下命令

```sh
docker run --rm -v "$(pwd)/config.yml:/config.yml" jacoblincool/bahamut-automation
# --rm: 容器執行完就自動刪除
# -v: 將主機目前目錄下的 `config.yml` 掛載至容器的 `/config.yml`
#     你可以改成任何主機上指向設定檔的位置，但要掛在 `/config.yml` 上
```

對應的 tag 有： `latest` = `all`, `chromium`, `firefox`, `webkit`, `chrome`, `msedge`

**只包含單一瀏覽器的 image 會覆寫 `browser.type` 及 `browser.executablePath` 至該 image 相對應的設定**

## 支援的架構

| Browser  | ARMv7 (`armv7l`) | ARMv8 (`aarch64`) | AMD64 (`x86_64`) |
| -------- | :--------------: | :---------------: | :--------------: |
| Chromium |        ✅         |         ✅         |        ✅         |
| Firefox  |        ✅         |         ✅         |        ✅         |
| WebKit   |        ❌         |         ✅         |        ✅         |
| Chrome   |        ❌         |         ❌         |        ✅         |
| Edge     |        ❌         |         ❌         |        ✅         |

<a id="use-other-platforms"></a>

### 其他雲端平台 （☁️）

嘗試過可以免費成功定時執行 Docker Image 的雲端平台：

- GitLab CI
- Oracle Cloud Always Free (Ampere 1 CPU / 6G RAM)

有想法嗎？發個 PR 吧！

_Replit?_ _Heroku?_ _Koyeb?_

## 為此專案貢獻

任何形式的貢獻都非常感謝！

你可以：

- 優化核心架構
- 新增或建議新模組
- 協助撰寫使用教學及文件
- 幫忙回答其他人遇到的問題
- 或做任何有益於此專案及開源社群的事！

### 如何開始？

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some cool things'`)
4. Push to the origin (`git push origin feat/amazing-feature`)
5. Open a pull request

[詳細開發說明可以看這邊](./CONTRIBUTING.md)

### 貢獻者們

感謝所有貢獻者們的貢獻！

這邊列出來的是在 Commit History 中找到的貢獻者們，除此之外，也有許多人幫忙回答問題、提報錯誤，以及跟大家一起討論。

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jacoblin.cool/"><img src="https://avatars.gitlabusercontent.com/u/28478594?v=4?s=96" width="96px;" alt=""/><br /><sub><b>JacobLinCool</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=JacobLinCool" title="Code">💻</a></td>
    <td align="center"><a href="https://dxball.gitlab.io/"><img src="https://avatars.gitlabusercontent.com/u/194673?v=4?s=96" width="96px;" alt=""/><br /><sub><b>Dxball ☕</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=dxball" title="Code">💻</a></td>
    <td align="center"><a href="https://cow03haha.gitlab.io/"><img src="https://avatars.gitlabusercontent.com/u/44705326?v=4?s=96" width="96px;" alt=""/><br /><sub><b>cow03haha</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=cow03haha" title="Code">💻</a></td>
    <td align="center"><a href="https://gitlab.com/Tony-Liou"><img src="https://avatars.gitlabusercontent.com/u/13446378?v=4?s=96" width="96px;" alt=""/><br /><sub><b>Zironic</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=Tony-Liou" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://gitlab.com/yslinear"><img src="https://avatars.gitlabusercontent.com/u/31029063?v=4?s=96" width="96px;" alt=""/><br /><sub><b>Ying-Shan Lin</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=yslinear" title="Code">💻</a></td>
    <td align="center"><a href="https://gitlab.com/IamSkyBlue"><img src="https://avatars.gitlabusercontent.com/u/34653812?v=4?s=96" width="96px;" alt=""/><br /><sub><b>IamSkyBlue</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=IamSkyBlue" title="Code">💻</a></td>
    <td align="center"><a href="https://gitlab.com/nico12313"><img src="https://avatars.gitlabusercontent.com/u/27029472?v=4?s=96" width="96px;" alt=""/><br /><sub><b>NicholasWu</b></sub></a><br /><a href="https://gitlab.com/jacoblincool/bahamut-automation/commits?author=nico12313" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## 授權條款

以 MIT License 授權，詳見 [`LICENSE`](./LICENSE)。

<!-- Links! -->
[banner-img]: web/Bahamut-Automation.png
[gitlab-url]: https://gitlab.com/jacoblincool/bahamut-automation
[discussion]: https://gitlab.com/JacobLinCool/bahamut-automation/-/issues
[discussion-qa]: https://gitlab.com/JacobLinCool/bahamut-automation/-/issues
[discussion-idea]: https://gitlab.com/JacobLinCool/bahamut-automation/-/issues
[contributors-shield]: https://img.shields.io/gitlab/contributors/jacoblincool/bahamut-automation.svg?style=flat-square&color=6f61ff
[contributors-url]: https://gitlab.com/JacobLinCool/bahamut-automation/-/graphs/main
[pull-shield]: https://img.shields.io/docker/pulls/jacoblincool/bahamut-automation.svg?style=flat-square&color=6f61ff
[pull-url]: https://hub.docker.com/r/jacoblincool/bahamut-automation
[version-shield]: https://img.shields.io/gitlab/v/tag/jacoblincool/bahamut-automation.svg?style=flat-square&color=6f61ff
[version-url]: https://gitlab.com/JacobLinCool/bahamut-automation/-/tags
[license-shield]: https://img.shields.io/gitlab/license/JacobLinCool/Bahamut-Automation.svg?style=flat-square&color=6f61ff
[license-url]: https://gitlab.com/JacobLinCool/bahamut-automation/-/blob/main/LICENSE
[product-screenshot]: images/screenshot.png
