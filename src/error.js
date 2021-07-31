function catchFatal(err) {
    console.error(err);
    process.exit(1);
}

function catchError(err) {
    console.error(err);
}

exports.catchFatal = catchFatal;
exports.catchError = catchError;
