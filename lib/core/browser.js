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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var events_1 = __importDefault(require("events"));
var playwright_1 = __importDefault(require("playwright"));
var BRWOSER_TYPES = ["chromium", "firefox", "webkit"];
var DEFAULT_BROWSER_CONFIG = {
    headless: true,
    firefoxUserPrefs: {
        "dom.webaudio.enabled": false,
        "media.volume_scale": 0
    }
};
var Browser = (function (_super) {
    __extends(Browser, _super);
    function Browser(browser_type, browser_config, logger) {
        if (logger === void 0) { logger = null; }
        var _this = _super.call(this) || this;
        _this.browser_type = browser_type;
        _this.browser_config = browser_config;
        _this.logger = logger;
        _this.browser = null;
        _this.context = null;
        _this.user_agent = "";
        if (!BRWOSER_TYPES.includes(browser_type)) {
            browser_type = "firefox";
        }
        _this.setup();
        return _this;
    }
    Browser.prototype.info = function () {
        var _a;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (this.logger) {
            (_a = this.logger).info.apply(_a, arg);
        }
    };
    Browser.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Browser.prototype.launch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var target, _a, temp_page, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.browser) return [3, 2];
                        this.info("使用瀏覽器", this.browser_type);
                        target = playwright_1["default"][this.browser_type];
                        _a = this;
                        return [4, target.launch(__assign(__assign({}, DEFAULT_BROWSER_CONFIG), this.browser_config))];
                    case 1:
                        _a.browser = _d.sent();
                        this.emit("launched", this.browser);
                        _d.label = 2;
                    case 2:
                        if (!!this.context) return [3, 7];
                        return [4, this.browser.newPage()];
                    case 3:
                        temp_page = _d.sent();
                        _b = this;
                        return [4, temp_page.evaluate(function () { return navigator.userAgent; })];
                    case 4:
                        _b.user_agent = (_d.sent()).replace("Headless", "") + " BA/1";
                        return [4, temp_page.close()];
                    case 5:
                        _d.sent();
                        this.info("User-Agent:", this.user_agent);
                        _c = this;
                        return [4, this.browser.newContext({ userAgent: this.user_agent })];
                    case 6:
                        _c.context = _d.sent();
                        this.emit("context_created", this.context);
                        _d.label = 7;
                    case 7: return [2, this];
                }
            });
        });
    };
    Browser.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser) return [3, 2];
                        return [4, this.browser.close()];
                    case 1:
                        _a.sent();
                        this.browser = null;
                        this.context = null;
                        this.user_agent = "";
                        this.emit("closed");
                        _a.label = 2;
                    case 2: return [2, this];
                }
            });
        });
    };
    Browser.prototype.new_page = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.context)
                            throw new Error("No Context.");
                        return [4, this.context.newPage()];
                    case 1:
                        page = _a.sent();
                        this.emit("new_page", page);
                        return [2, page];
                }
            });
        });
    };
    return Browser;
}(events_1["default"]));
exports["default"] = Browser;
