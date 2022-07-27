import countapi from "countapi-js";

export async function stats() {
    const keys: Record<string, string[]> = {
        run: ["自動化執行次數", "次"],
        answer: ["動畫瘋回答獎勵", "巴幣"],
        lottery: ["成功抽獎次數", "次"],
        sign: ["成功簽到次數", "次"],
    };

    console.log("匿名數據統計資料");
    for (const key in keys) {
        const result = await countapi.get("Bahamut-Automation", key);
        console.log(`  ${keys[key][0]}: ${result.value} ${keys[key][1]}`);
    }
}
