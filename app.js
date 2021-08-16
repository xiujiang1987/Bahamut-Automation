const { readFileSync } = require("fs");
const { cwd, exit, argv } = require("process");
const { main } = require("./src/main.js");

const config_path = argv[2] || cwd() + "/config.json";
let config_file, config;

try {
    config_file = readFileSync(config_path, "utf8");
} catch (err) {
    console.error("無法讀取 " + config_path);
    console.error(err.message);
    exit(1);
}
try {
    config = JSON.parse(config_file);
} catch (err) {
    console.error("無法解析 " + config_path);
    console.error(err.message);
    exit(1);
}
console.log("成功讀取 " + config_path);

main({
    config: config.config,
    modules: config.modules,
    ...config.parameters,
    ...config.secrets,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
