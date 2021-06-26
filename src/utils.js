import fs from "fs";

function sleep(t = 1000) {
    return new Promise((r) => {
        setTimeout(r, t);
    });
}

function log(msg) {
    console.log(msg);
    fs.appendFileSync("./log/log.txt", `[${new Date().toLocaleString("en-GB", { timeZone: "Asia/Taipei" })}] ${msg} \n`);
}

async function err_handler(err, page = null) {
    let time = Date.now();
    log(`\n<ERROR ${time}> ` + err);
    if (page) await page.screenshot({ path: `./screenshot/.err.${time}.jpg`, type: "jpeg" });
}

export { log, err_handler };
