const { argv, env } = require("process");
const { main } = require("./src/main.js");

// 下面這行會決定 Issue Report 會發到哪裡，如要使用請改成你自己的
// env.GITHUB_REPOSITORY = "JacobLinCool/BA";

[NODE, PROGRAM, Modules, Secrets, Parameters] = argv;

const modules = Modules.split(",").map((x) => x.trim());
const parameters = JSON.parse(Parameters || "{}");
const secrets = JSON.parse(Secrets || "{}");

main({
    modules,
    ...parameters,
    ...secrets,
}).then((msg) => {
    console.log(msg);
    process.exit(0);
});
