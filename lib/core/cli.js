"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var _1 = __importDefault(require("./"));
var readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, mode, config_path, _a, _b, _c, config, automation;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    args = parsed_args();
                    if (args["help"] || args["h"]) {
                        help();
                        process.exit(0);
                    }
                    mode = (args["mode"] ? +args["mode"][0] : null) || (args["m"] ? +args["m"][0] : null);
                    if (!(mode !== 1 && mode !== 2)) return [3, 3];
                    _d.label = 1;
                case 1:
                    if (!true) return [3, 3];
                    return [4, ask(["選擇模式: ", "1. 設定檔執行", "2. 直接執行", ">> "].join("\n"))];
                case 2:
                    mode = +(_d.sent());
                    if (mode === 1 || mode === 2)
                        return [3, 3];
                    return [3, 1];
                case 3:
                    if (!(mode === 1)) return [3, 8];
                    config_path = (args["config"] ? args["config"][0] : null) || (args["c"] ? args["c"][0] : null);
                    if (config_path)
                        config_path = path_1["default"].resolve(process.cwd(), config_path);
                    if (!!fs_1["default"].existsSync(config_path)) return [3, 6];
                    _d.label = 4;
                case 4:
                    if (!true) return [3, 6];
                    _b = (_a = path_1["default"]).resolve;
                    _c = [process.cwd()];
                    return [4, ask("請輸入設定檔位置: ")];
                case 5:
                    config_path = _b.apply(_a, _c.concat([_d.sent()]));
                    if (fs_1["default"].existsSync(config_path))
                        return [3, 6];
                    console.log("設定檔不存在:", config_path);
                    return [3, 4];
                case 6:
                    config = require(config_path);
                    automation = new _1["default"](config);
                    return [4, automation.run()];
                case 7:
                    _d.sent();
                    return [3, 9];
                case 8:
                    if (mode === 2) {
                        console.log("抱歉，我還沒實作這個功能。 :(");
                    }
                    _d.label = 9;
                case 9:
                    console.log("程式執行完畢");
                    process.exit(0);
                    return [2];
            }
        });
    });
}
function ask(question) {
    if (question === void 0) { question = ""; }
    return new Promise(function (resolve) { return readline.question(question, resolve); });
}
function parsed_args() {
    var args = process.argv.slice(2);
    var parsed = {};
    var now = null;
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (arg.startsWith("--")) {
            now = arg.slice(2);
            if (!parsed[now])
                parsed[now] = [];
        }
        else if (arg.startsWith("-")) {
            now = arg.slice(1);
            if (!parsed[now])
                parsed[now] = [];
        }
        else if (now) {
            parsed[now].push(arg);
        }
    }
    return parsed;
}
function help() {
    console.log("參數: [--mode=1|2] [--config=path] [--help]");
    console.log("  --mode (-m): 設定檔執行模式");
    console.log("  --config (-c): 設定檔位置");
    console.log("  --help (-h): 顯示此說明");
}
