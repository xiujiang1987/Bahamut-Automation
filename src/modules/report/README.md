# Report Module

這個模組用於生成報告。

它會提供 `shared.report.reports` 讓其他模組把報告放入。

```ts
shared.report.reports["module_name"] = "# Report\n ...";
```

使用輸出函式來取得報告：

```ts
await shared.report.text();
await shared.report.markdown();
await shared.report.html();
```
