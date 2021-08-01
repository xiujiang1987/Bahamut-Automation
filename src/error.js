const { sentryCaptureException } = require("./sentry");

function catchFatal(err) {
    console.error("[FATAL] " + err.message);
    console.error(err.stack);
    process.exit(1);
}

function catchError(err) {
    console.error(err.message);
    sentryCaptureException(err);
}

function indentedCatchError(space = 2) {
    return (err) => {
        console.error(" ".repeat(space) + err.message);
        sentryCaptureException(err);
    };
}

exports.catchFatal = catchFatal;
exports.catchError = catchError;
exports.indentedCatchError = indentedCatchError;
