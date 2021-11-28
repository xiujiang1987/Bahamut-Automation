"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var Logger = (function () {
    function Logger(space) {
        if (space === void 0) { space = 0; }
        this.space = 0;
        this.prefix = "";
        this.space = space;
        this.prefix = " ".repeat(space);
    }
    Logger.prototype.next = function () {
        return new Logger(this.space + 2);
    };
    Logger.prototype.log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([this.prefix, "\u001b[94m" + "[LOG]" + "\u001b[m"], msg, false));
    };
    Logger.prototype.error = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([this.prefix, "\u001b[91m" + "[ERROR]" + "\u001b[m"], msg, false));
    };
    Logger.prototype.warn = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([this.prefix, "\u001b[93m" + "[WARN]" + "\u001b[m"], msg, false));
    };
    Logger.prototype.info = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([this.prefix, "\u001b[96m" + "[INFO]" + "\u001b[m"], msg, false));
    };
    Logger.prototype.debug = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([this.prefix, "\u001b[95m" + "[DEBUG]" + "\u001b[m"], msg, false));
    };
    return Logger;
}());
exports["default"] = Logger;
