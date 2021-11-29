/* minified */
const countapi=require("countapi-js");async function getList({page:a,error:t}){let e,i=3;for(;0<i--;){e=[];try{await a.goto("https://fuli.gamer.com.tw/shop.php?page=1");let t=await a.$$("a.items-card");for(let a=t.length-1;0<=a;a--)await t[a].evaluate(a=>a.innerHTML.includes("抽抽樂"))&&e.push({name:await t[a].evaluate(a=>a.querySelector(".items-title").innerHTML),link:await t[a].evaluate(a=>a.href)});for(;await a.$eval("a.pagenow",a=>!!a.nextSibling);){await a.goto("https://fuli.gamer.com.tw/shop.php?page="+await a.$eval("a.pagenow",a=>a.nextSibling.innerText));let t=await a.$$("a.items-card");for(let a=t.length-1;0<=a;a--)await t[a].evaluate(a=>a.innerHTML.includes("抽抽樂"))&&e.push({name:await t[a].evaluate(a=>a.querySelector(".items-title").innerHTML),link:await t[a].evaluate(a=>a.href)})}break}catch(a){t(a)}}return e}async function checkInfo({page:a,log:t,error:e}){try{var i=await a.$eval("#name",a=>a.value),r=await a.$eval("#tel",a=>a.value),o=await a.$eval("[name=city]",a=>a.value),n=await a.$eval("[name=country]",a=>a.value),c=await a.$eval("#address",a=>a.value);if(i||t("無收件人姓名"),r||t("無收件人電話"),o||t("無收件人城市"),n||t("無收件人區域"),c||t("無收件人地址"),!(i&&r&&o&&n&&c))throw new Error("警告：收件人資料不全")}catch(a){e(a)}}async function confirm({page:t,error:e}){try{await t.click("#agree-confirm"),await t.waitForSelector("#buyD > div.pbox-btn > a"),await t.waitForTimeout(100),await t.click("#buyD > div.pbox-btn > a"),await t.waitForSelector("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary"),await t.waitForTimeout(100),await Promise.all([t.waitForNavigation(),t.click("#dialogify_1 > form > div > div > div.btn-box.text-right > button.btn.btn-insert.btn-primary")]),await t.waitForTimeout(1e3)}catch(a){console.debug(t.url()),e(a)}}function report({lottery:a,unfinished:t}){let e="# 福利社抽抽樂 \n\n";return a&&(e+=`✨✨✨ 獲得 **${a}** 個抽獎機會，價值 **${(500*a).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}** 巴幣 ✨✨✨
`),0===Object.keys(t).length&&(e+="🟢 所有抽獎皆已完成\n"),Object.keys(t).forEach(a=>{void 0!==t[a]&&(e+=`❌ 未能自動完成所有 ***[${a}](${t[a]})*** 的抽獎
`)}),e+="\n",e}exports.parameters=[{name:"lottery_max_attempts",required:!1}],exports.run=async({page:i,outputs:r,params:a,logger:t})=>{const o=(...a)=>t.log("[95m[福利社][m",...a);var n=(...a)=>t.error("[95m[福利社][m",...a);if(!r.login||!r.login.success)throw new Error("使用者未登入，無法抽獎");if(!r.ad_handler)throw new Error("需使用 ad_handler 模組");o("開始執行");let c=0;o("正在尋找抽抽樂");const l=await getList({page:i,error:n});o(`找到 ${l.length} 個抽抽樂`);const w={};l.forEach(({name:a,link:t},e)=>{o(e+1+": "+a),w[a]=t});for(let e=0;e<l.length;e++){o(`正在嘗試執行第 ${e+1} 個抽抽樂： `+l[e].name);var u=+a.lottery_max_attempts||30;for(let a=1;a<=u;a++){await i.goto(l[e].link).catch(n),await i.waitForSelector("#BH-master > .BH-lbox.fuli-pbox h1"),await i.waitForTimeout(100);var s,m=await i.$eval("#BH-master > .BH-lbox.fuli-pbox h1",a=>a.innerHTML);if(await i.$(".btn-base.c-accent-o.is-disable")){o(`第 ${e+1} 個抽抽樂（${l[e].name}）的廣告免費次數已用完 [92m✔[m`),w[l[e].name]=void 0;break}o(`正在執行第 ${a} 次抽獎，可能需要多達 1 分鐘`),await i.click(".btn-base.c-accent-o").catch(n),await i.waitForTimeout(3e3),await i.$eval(".dialogify",a=>a.innerText.includes("勇者問答考驗")).catch(()=>{})&&(o("需要回答問題，正在回答問題"),await i.$$eval("#dialogify_1 .dialogify__body a",a=>{a.forEach(a=>{a.dataset.option==a.dataset.answer&&a.click()})}),await i.waitForSelector("#btn-buy"),await i.waitForTimeout(100),await i.click("#btn-buy")),await i.waitForTimeout(5e3);let t=await i.$eval(".dialogify .dialogify__body p",a=>a.innerText).catch(()=>{})||"";if(t.includes("廣告能量補充中"))await n("廣告能量補充中"),await i.reload().catch(n);else{if(t.includes("觀看廣告")){o("正在觀看廣告"),await i.click("button[type=submit].btn.btn-insert.btn-primary").catch(n),await i.waitForSelector("ins iframe").catch(n),await i.waitForTimeout(1e3);const d=await i.$("ins iframe").catch(n);try{s=await d.contentFrame(),await r.ad_handler({ad_frame:s})}catch(a){n(a)}await i.waitForTimeout(1e3)}else o(t);let a=i.url();a.includes("/buyD.php")&&a.includes("ad=1")?(o("正在確認結算頁面"),await checkInfo({page:i,log:o,error:n}).catch(n),await confirm({page:i,error:n}).catch(n),await i.$(".card > .section > p")&&await i.$eval(".card > .section > p",a=>a.innerText.includes("成功"))?(o("已完成一次抽抽樂："+m+" [92m✔[m"),c++):o("發生錯誤，重試中 [91m✘[m")):n("未進入結算頁面 ("+a+")，重試中 [91m✘[m")}}}return Object.keys(w).forEach(a=>void 0===w[a]&&delete w[a]),await i.waitForTimeout(2e3),o("執行完畢 ✨"),c&&countapi.update("Bahamut-Automation","lottery",c),{lottery:c,unfinished:w,report:report}};