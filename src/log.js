function log(msg) {
    console.log(msg);
}

function indentedLog(space = 2) {
    return function (msg) {
        console.log(" ".repeat(space) + msg);
    };
}

exports.log = log;
exports.indentedLog = indentedLog;
