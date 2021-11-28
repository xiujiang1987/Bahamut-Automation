"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
process.env.TZ = "Asia/Taipei";
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var events_1 = __importDefault(require("events"));
var countapi_js_1 = __importDefault(require("countapi-js"));
var logger_1 = __importDefault(require("./logger"));
var browser_1 = __importDefault(require("./browser"));
var utils_1 = require("./utils");
var VERSION = get_version();
function get_version() {
    try {
        var depth = 5;
        var package_path = path_1["default"].resolve(__dirname, "package.json");
        while (!fs_1["default"].existsSync(package_path) && depth-- > 0) {
            package_path = path_1["default"].resolve(path_1["default"].dirname(package_path), "..", "package.json");
        }
        return require(package_path).version;
    }
    catch (err) {
        return "";
    }
}
var BahamutAutomation = (function (_super) {
    __extends(BahamutAutomation, _super);
    function BahamutAutomation(_a) {
        var _b = _a.modules, modules = _b === void 0 ? [] : _b, _c = _a.params, params = _c === void 0 ? {} : _c, _d = _a.browser, browser = _d === void 0 ? {} : _d;
        var _this = _super.call(this) || this;
        _this.logger = new logger_1["default"]();
        _this.start_time = null;
        _this.end_time = null;
        _this.browser_config = browser;
        _this.modules = modules;
        _this.params = params;
        _this.setup();
        return _this;
    }
    BahamutAutomation.prototype.setup = function () {
        var self = this;
        this.on("start", function () {
            self.log("開始執行巴哈姆特自動化 " + VERSION);
            countapi_js_1["default"].update("Bahamut-Automation", "run", 1);
        });
        this.on("module_start", function (module_name, module_path) {
            self.log("\u57F7\u884C ".concat(module_name, " \u6A21\u7D44 (").concat(module_path, ")"));
        });
        this.on("module_loaded", function (module_name, module) {
            self.log("\u53C3\u6578: ".concat(module.parameters.map(function (_a) {
                var name = _a.name, required = _a.required;
                return " ".concat(name).concat(required ? "*" : "");
            }).join(" ") || "無"));
        });
        this.on("module_finished", function (module_name) {
            self.log("\u6A21\u7D44 ".concat(module_name, " \u57F7\u884C\u5B8C\u7562\n"));
        });
        this.on("module_failed", function (module_name, err) {
            self.logger.error("\u6A21\u7D44 ".concat(module_name, " \u57F7\u884C\u5931\u6557\n"));
            self.logger.error(err);
        });
        this.on("finished", function (outputs, time) {
            self.log("巴哈姆特自動化執行完畢");
            self.log("\u57F7\u884C\u6642\u9593: ".concat(second_to_time(time)));
            self.log("輸出:", outputs);
        });
        this.on("fatal", function (err) {
            self.logger.error("巴哈姆特自動化執行失敗");
            self.logger.error(err);
            if (self.browser) {
                self.browser.close();
            }
        });
    };
    BahamutAutomation.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var outputs, _i, _a, module_name, module_path, module_1, module_page, module_params, _b, _c, _d, name_1, required, _e, _f, err_1, time, err_2;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 18, , 19]);
                        this.start_time = Date.now();
                        this.emit("start");
                        this.browser = new browser_1["default"](this.browser_config.type || "firefox", this.browser_config, this.logger);
                        return [4, this.browser.launch()];
                    case 1:
                        _g.sent();
                        this.emit("browser_opened");
                        outputs = {};
                        _i = 0, _a = this.modules;
                        _g.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3, 16];
                        module_name = _a[_i];
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 12, , 13]);
                        module_path = path_1["default"].resolve(__dirname, "../modules", module_name);
                        if (path_1["default"].isAbsolute(module_name)) {
                            module_name = path_1["default"].basename(module_name);
                        }
                        this.emit("module_start", module_name, module_path);
                        module_1 = require(module_path);
                        this.emit("module_loaded", module_name, module_1);
                        return [4, this.browser.new_page()];
                    case 4:
                        module_page = _g.sent();
                        module_params = {};
                        _b = 0, _c = module_1.parameters;
                        _g.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3, 9];
                        _d = _c[_b], name_1 = _d.name, required = _d.required;
                        if (!(this.params[name_1] !== undefined)) return [3, 6];
                        module_params[name_1] = this.params[name_1];
                        return [3, 8];
                    case 6:
                        if (!required) return [3, 8];
                        return [4, module_page.close()];
                    case 7:
                        _g.sent();
                        this.emit("module_parameter_error", module_name, name_1);
                        throw new Error("\u6A21\u7D44 ".concat(module_name, " \u6240\u5FC5\u9808\u4E4B ").concat(name_1, " \u53C3\u6578\u4E0D\u5B58\u5728"));
                    case 8:
                        _b++;
                        return [3, 5];
                    case 9:
                        _e = outputs;
                        _f = module_name;
                        return [4, module_1.run({
                                page: module_page,
                                outputs: outputs,
                                params: module_params,
                                logger: this.logger.next()
                            })];
                    case 10:
                        _e[_f] = _g.sent();
                        return [4, module_page.close()];
                    case 11:
                        _g.sent();
                        this.emit("module_finished", module_name);
                        return [3, 13];
                    case 12:
                        err_1 = _g.sent();
                        this.emit("module_failed", module_name, err_1);
                        return [3, 13];
                    case 13: return [4, (0, utils_1.sleep)(1000)];
                    case 14:
                        _g.sent();
                        _g.label = 15;
                    case 15:
                        _i++;
                        return [3, 2];
                    case 16: return [4, this.browser.close()];
                    case 17:
                        _g.sent();
                        this.end_time = Date.now();
                        time = Math.floor((this.end_time - this.start_time) / 1000);
                        this.emit("finished", JSON.parse(JSON.stringify(outputs)), time);
                        return [2, { outputs: JSON.parse(JSON.stringify(outputs)), time: time }];
                    case 18:
                        err_2 = _g.sent();
                        this.emit("fatal", err_2);
                        return [2, null];
                    case 19: return [2];
                }
            });
        });
    };
    BahamutAutomation.prototype.log = function () {
        var _a;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        (_a = this.logger).log.apply(_a, arg);
        this.emit.apply(this, __spreadArray(["log"], arg, false));
    };
    return BahamutAutomation;
}(events_1["default"]));
function second_to_time(second) {
    var hour = Math.floor(second / 3600);
    var minute = Math.floor((second - hour * 3600) / 60);
    var second_left = second - hour * 3600 - minute * 60;
    return "".concat(hour, " \u5C0F\u6642 ").concat(minute, " \u5206 ").concat(second_left, " \u79D2");
}
exports["default"] = BahamutAutomation;
