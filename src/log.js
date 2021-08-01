function log(msg) {
    console.log(msg);
}

function indentedLog(space = 2) {
    return (msg) => log(" ".repeat(space) + msg);
}

exports.log = log;
exports.indentedLog = indentedLog;
