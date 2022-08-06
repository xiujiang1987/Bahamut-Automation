# [1.0.0-pre.17](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v1.0.0-pre.9...v1.0.0-pre.17) (2022-08-06)


### Bug Fixes

* `deep_merge` no source crashing ([8e6092b](https://gitlab.com/JacobLinCool/bahamut-automation/commit/8e6092bdf2ee52128c4acf7b0cb226fb7e76b80b))
* duplicated button click on sign ([33f23bb](https://gitlab.com/JacobLinCool/bahamut-automation/commit/33f23bb72a7eeaa288da1548ec77abf1730b69f2))
* eval runtime error when no need to solve reCAPTCHA ([4f045ae](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4f045ae0c082feb88d926895dad4ab6f04bb9e15))
* failed to dynamic import file path on Windows ([16311e9](https://gitlab.com/JacobLinCool/bahamut-automation/commit/16311e94fd9a97060dd98621b5e42a78da82406f))
* logout error ([4b229f0](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4b229f01ae653344e27c99eef1ddf59936a9eac8))
* lottery checkbox false alert ([ec0671d](https://gitlab.com/JacobLinCool/bahamut-automation/commit/ec0671de2629dedf60d5d49d2af839d31d6148a1))
* use path of pw firefox and webkit as default ([38a92fc](https://gitlab.com/JacobLinCool/bahamut-automation/commit/38a92fc61fa841742cb613bc25c15c70cc6a0bac))


### Features

* `VERBOSE` constant ([88ed427](https://gitlab.com/JacobLinCool/bahamut-automation/commit/88ed427a2bfb46becb492b9c42140c0760628779))
* add more cli commands ([39ba023](https://gitlab.com/JacobLinCool/bahamut-automation/commit/39ba023208fec4204b11deca68c929967b5bb58f))
* auto resolve reCAPTCHA ([33087cd](https://gitlab.com/JacobLinCool/bahamut-automation/commit/33087cd61985a84c677932a10b0d1062e707f416))
* export `booleanify` to utils ([a1feb4f](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a1feb4ff65fd82db1fba555f0e75fc1a69ec6225))
* improved reCAPTCHA solver (upstream) ([5dd14ee](https://gitlab.com/JacobLinCool/bahamut-automation/commit/5dd14ee137992a20853b148f8adf69f1cabf1bfc))
* launcher verbose mode ([969acb4](https://gitlab.com/JacobLinCool/bahamut-automation/commit/969acb47293e7c9f90f4e6f8efbe999811479324))
* override config fields with options `-o` ([06310a2](https://gitlab.com/JacobLinCool/bahamut-automation/commit/06310a225b25d9288905a63ed5b312a46f256b34))
* purify core lib logic and export objects ([b58136b](https://gitlab.com/JacobLinCool/bahamut-automation/commit/b58136ba34fc5491c73c391ca874aadc40cd56ea))
* show `Try it later` when no reCAPTCHA audio detected ([4b47da8](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4b47da8b0117d0832e9a279b906ac4e86eb1fde4))
* upgrade recaptcha-solver to support arm64 linux ([dfaa3eb](https://gitlab.com/JacobLinCool/bahamut-automation/commit/dfaa3eb6ce817dcd0edb890306344712367c09fb))


### Performance Improvements

* remove unnecessary timeouts ([54668a4](https://gitlab.com/JacobLinCool/bahamut-automation/commit/54668a46ade094b8b54a337fd083b50f4100696a))


### Reverts

* Revert "build(docker): force reinstall libc-bin" ([4a58eb7](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4a58eb731533c4b5b54d2417bf3188ae3b98e26d))
* Revert "build: back to cjs" ([31e0262](https://gitlab.com/JacobLinCool/bahamut-automation/commit/31e0262efa3a4234bc2510ab1628f15ce8c72c04))



# [1.0.0-pre.9](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v1.0.0-pre.8...v1.0.0-pre.9) (2022-07-11)


### Features

* simplify cli, remove interactive ui ([dffb641](https://gitlab.com/JacobLinCool/bahamut-automation/commit/dffb641992ffc9b1375f78c9aa49eb16a0205097))



# [1.0.0-pre.8](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v1.0.0-pre.7...v1.0.0-pre.8) (2022-07-11)



# [1.0.0-pre.7](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.8...v1.0.0-pre.7) (2022-07-09)


### Bug Fixes

* 無法獲得雙倍簽到 ([827f4f4](https://gitlab.com/JacobLinCool/bahamut-automation/commit/827f4f42d818a85c3eed3ab12665e9936f3800db))
* action secret replacing escape ([b9a21fd](https://gitlab.com/JacobLinCool/bahamut-automation/commit/b9a21fd0c8b48720d6a9257588413746a29dbf4a))
* **action:** avoid npm audit failed ([69dbeae](https://gitlab.com/JacobLinCool/bahamut-automation/commit/69dbeaef3adf2cbb737d8cdb891bfb5ae2362bef))
* **action:** change action.yml location ([ffdfa4e](https://gitlab.com/JacobLinCool/bahamut-automation/commit/ffdfa4e0bc66e004b2dcc34b8e82f164652f3ba3))
* **action:** commonjs export fix ([c8ac91b](https://gitlab.com/JacobLinCool/bahamut-automation/commit/c8ac91b5c18d08a9eca58f19cbdd9e985651e6ef))
* **action:** copy lock file too ([3def421](https://gitlab.com/JacobLinCool/bahamut-automation/commit/3def421356968a012c98d87cd1f020b2bc2b2759))
* **action:** copy package.json ([8ee3dd3](https://gitlab.com/JacobLinCool/bahamut-automation/commit/8ee3dd3a18c5e3b506e362600d9dd6fb81e69016))
* **action:** dependencies installation cwd ([686bbab](https://gitlab.com/JacobLinCool/bahamut-automation/commit/686bbab3ac53753e9e934de15ea8e729b6fa499a))
* **action:** install dependencies at runtime ([c30155c](https://gitlab.com/JacobLinCool/bahamut-automation/commit/c30155c9d8009146a7cca633ab6f6678b234ebd5))
* **action:** install-deps typo & [#32](https://gitlab.com/JacobLinCool/bahamut-automation/issues/32) workaround ([852347c](https://gitlab.com/JacobLinCool/bahamut-automation/commit/852347cc411bfa68468370cd66f93dfc7e2c77c2))
* **action:** update action default parameters ([75a4ebe](https://gitlab.com/JacobLinCool/bahamut-automation/commit/75a4ebe8d12248fa95895943c8c097e3ed6a2ef2))
* **action:** use [#32](https://gitlab.com/JacobLinCool/bahamut-automation/issues/32) workaround ([3b6e9f7](https://gitlab.com/JacobLinCool/bahamut-automation/commit/3b6e9f701c20f139e7e3a4a3fafb34e115405133))
* build scripts dir not exists ([e9b0ce8](https://gitlab.com/JacobLinCool/bahamut-automation/commit/e9b0ce855e2d749b7a6f6267914a4c29acfd2c92))
* cli trim inputs ([b83b62d](https://gitlab.com/JacobLinCool/bahamut-automation/commit/b83b62d17fcb7d772ae28b55c0715436250bf26c))
* **core:** make firefox be muted ([53f4538](https://gitlab.com/JacobLinCool/bahamut-automation/commit/53f45384651b64bf8c9ebddab065630ef74e042a))
* **core:** package.json searching bug ([5ba4bf9](https://gitlab.com/JacobLinCool/bahamut-automation/commit/5ba4bf9f4479ef6e9245db68565b6a0ed8534abe))
* **core:** remove default args due to webkit error ([e8f3894](https://gitlab.com/JacobLinCool/bahamut-automation/commit/e8f3894f5afe186174ef8a6d4b6229e2137a90e4))
* **deps:** update dependency markdown-it to v13 ([a61b842](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a61b842420b662a3610035a11e5cf6321345980a))
* install pnpm first ([88a0d42](https://gitlab.com/JacobLinCool/bahamut-automation/commit/88a0d42abc5a5693ba369b26e004793bd526c915))
* logout redirection ([aaa5035](https://gitlab.com/JacobLinCool/bahamut-automation/commit/aaa5035105dc310930e755521aa1b480b199c55b))
* lottery r18 warning ([bfe980e](https://gitlab.com/JacobLinCool/bahamut-automation/commit/bfe980e0c4a722fc55bf1bf3ff66155ed5ed523c))
* make lottery button selector more specific ([#122](https://gitlab.com/JacobLinCool/bahamut-automation/issues/122), [#123](https://gitlab.com/JacobLinCool/bahamut-automation/issues/123)) ([ff75db8](https://gitlab.com/JacobLinCool/bahamut-automation/commit/ff75db832d9e15c63e085c3212bb09b3690bda16))
* **module:** answer ts mis-renamed fetch ([a12ce6e](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a12ce6e3286e4145dae007a5ebe0b142c51c9850))
* **module:** continue to play Google AD with sound ([a7d2523](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a7d2523135f657cf302a265fd8538e3565d96760))
* **module:** guild minify eval same name error ([d6e60cf](https://gitlab.com/JacobLinCool/bahamut-automation/commit/d6e60cf879d3532fbe386552f53a43246f272f77))
* **module:** IModule interface wrong declared constructor ([eea80d0](https://gitlab.com/JacobLinCool/bahamut-automation/commit/eea80d00582d2a93b391ea5af77b4d32db94058f))
* **module:** line_notify == -> === ([68ab988](https://gitlab.com/JacobLinCool/bahamut-automation/commit/68ab988ffbfd3dae9c9df531b9207096a65daed1))
* **module:** lottery pool ([6b3e40c](https://gitlab.com/JacobLinCool/bahamut-automation/commit/6b3e40c6f4fa208b94f853cff2dc507d0d256e8f))
* **module:** lottery types error ([a1d7f13](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a1d7f139b11f23b0306912fd9c2b557648575337))
* **module:** old variables clean up ([4b4e228](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4b4e2286440c572be5f28a52bc5c535962847a04))
* **module:** report modules md replace ([e59f91b](https://gitlab.com/JacobLinCool/bahamut-automation/commit/e59f91b48849bb0ae0a3df1a3e35acd0e6b2456f))
* **modules:** lottery multi-task memory leak ([fb57be5](https://gitlab.com/JacobLinCool/bahamut-automation/commit/fb57be50248898817eb28a2dbc560a9e8188728f))
* **modules:** lottery selectors ([e5eeebb](https://gitlab.com/JacobLinCool/bahamut-automation/commit/e5eeebb073737271423fcf58d3f645b60dc11fe3))
* tsup minifying errors ([ee17605](https://gitlab.com/JacobLinCool/bahamut-automation/commit/ee17605ac682ce7b2250f4ccabf1ba1f09111521))
* update 2FA detect in login module ([4708512](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4708512f5a897bcc533e52f3d901a3fea38df700))
* x-platform `rm` in build scripts ([d446826](https://gitlab.com/JacobLinCool/bahamut-automation/commit/d44682682b49983b72dce94957a5bcc7629fff10))


### Features

* **action:** remove unnecessary dep install messages ([3b94473](https://gitlab.com/JacobLinCool/bahamut-automation/commit/3b944735ff1b42e137bb525d158961b84ce3da96))
* add Cookie Login module ([6650494](https://gitlab.com/JacobLinCool/bahamut-automation/commit/66504945625fb606b4e2d966a24e881fafdbda77))
* add v1 docs ([d384ed2](https://gitlab.com/JacobLinCool/bahamut-automation/commit/d384ed25f5599e4e692e127c450320362af228ff))
* **core:** better type defs ([c9595ea](https://gitlab.com/JacobLinCool/bahamut-automation/commit/c9595ea052f7c32a7fdb8a2d747dbcae39681671))
* **core:** measure execution time & return it ([1bc3438](https://gitlab.com/JacobLinCool/bahamut-automation/commit/1bc34386e0b988eeee9fc3222f422bb3052e5b46))
* **core:** show browser info at launch ([e95129f](https://gitlab.com/JacobLinCool/bahamut-automation/commit/e95129f2c9caa2c97e23bf25f05a78a82e702a35))
* **core:** support ts modules ([abe0cc1](https://gitlab.com/JacobLinCool/bahamut-automation/commit/abe0cc137c05f4966596fe0eed7dac853967931c))
* docker image support ([d10d0d5](https://gitlab.com/JacobLinCool/bahamut-automation/commit/d10d0d55333c857f602d824ded9b47abab207596))
* drop support for GitHub ([fbd4383](https://gitlab.com/JacobLinCool/bahamut-automation/commit/fbd4383703968f2877336dae54d1ceb848ef7f92))
* ESM & lottery question & ... ([f3abc36](https://gitlab.com/JacobLinCool/bahamut-automation/commit/f3abc360a75aedc530cdd767bcfdc9c6db6cb497))
* fit in new module system ([6fecc7a](https://gitlab.com/JacobLinCool/bahamut-automation/commit/6fecc7a5f9898d53d825c7fdf78c46bf1b9767d1))
* hide built-in module path ([36f6799](https://gitlab.com/JacobLinCool/bahamut-automation/commit/36f6799bd94166966fddae41cbb794def8da32c9))
* **module:** add lottery plus module ([2d20311](https://gitlab.com/JacobLinCool/bahamut-automation/commit/2d20311fd23d5ce68488a18d2184102650fc7c3c))
* **module:** add test module ([d6be0a4](https://gitlab.com/JacobLinCool/bahamut-automation/commit/d6be0a4e29ec21f6537063dc6e8fc285fdddc239))
* **module:** module can be written in TS now ([43dd6c9](https://gitlab.com/JacobLinCool/bahamut-automation/commit/43dd6c9fc36bcb0de42dd707f2ac098fe1940839))
* **modules:** add del_mail module ([b636f16](https://gitlab.com/JacobLinCool/bahamut-automation/commit/b636f1664dcf1e2966b0575f5179b285efcee3dd))
* **modules:** report `only_failed` param ([b493bdc](https://gitlab.com/JacobLinCool/bahamut-automation/commit/b493bdc2f24dc06d9b4112eb481af4ca62f6e2c1))
* **modules:** sign throw error msg when no ads ([421226a](https://gitlab.com/JacobLinCool/bahamut-automation/commit/421226a1cfe590297444f25646a9fe53480fadbb))
* **module:** ts modules ([2a61556](https://gitlab.com/JacobLinCool/bahamut-automation/commit/2a61556fd427a0f44609ae0b388a80849f266000))
* new action with `config` and `secrets` ([bc80831](https://gitlab.com/JacobLinCool/bahamut-automation/commit/bc808310d4c9d705999116afafa6df7b3faa42e5))
* remove cookie_login module ([2330645](https://gitlab.com/JacobLinCool/bahamut-automation/commit/2330645c92aae24589a1f80fd7ae36fec088893e))
* simplify docker volume binding path ([9e97b41](https://gitlab.com/JacobLinCool/bahamut-automation/commit/9e97b4140e67a4b65c9f880da97be810b15a1859))
* util functions ([a23c78e](https://gitlab.com/JacobLinCool/bahamut-automation/commit/a23c78e7d2568bb8afbc8739eb30a1960046dc62))


### Reverts

* Revert "chore: update packages" ([4f1adb2](https://gitlab.com/JacobLinCool/bahamut-automation/commit/4f1adb2cde4d0112bd02dde8b6d9daa8275c6e1c))



## [0.6.8](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.7...v0.6.8) (2021-08-14)



## [0.6.7](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.6...v0.6.7) (2021-08-09)



## [0.6.6](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.5...v0.6.6) (2021-08-07)



## [0.6.5](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.4...v0.6.5) (2021-08-07)



## [0.6.4](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.3...v0.6.4) (2021-08-06)



## [0.6.3](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.2...v0.6.3) (2021-08-04)



## [0.6.2](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.6.1...v0.6.2) (2021-08-03)



## [0.6.1](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.7...v0.6.1) (2021-08-02)



## [0.5.7](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.6...v0.5.7) (2021-07-31)



## [0.5.6](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.5...v0.5.6) (2021-07-28)



## [0.5.5](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.4...v0.5.5) (2021-07-27)



## [0.5.4](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.3...v0.5.4) (2021-07-24)



## [0.5.3](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.2...v0.5.3) (2021-07-07)



## [0.5.2](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.5.1...v0.5.2) (2021-07-04)



## [0.5.1](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.4.1...v0.5.1) (2021-07-02)


### Bug Fixes

* 抽抽樂需要回答問題時自動回答 ([ab3884c](https://gitlab.com/JacobLinCool/bahamut-automation/commit/ab3884c11095d1108b615e1290dbe1ea3ed022d2))



## [0.4.1](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.2.2...v0.4.1) (2021-06-30)



## [0.2.2](https://gitlab.com/JacobLinCool/bahamut-automation/compare/v0.2.1...v0.2.2) (2021-06-27)



## 0.2.1 (2021-06-27)



