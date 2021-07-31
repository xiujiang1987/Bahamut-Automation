const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

let _transaction;

function sentryInit() {
    Sentry.init({
        dsn: "https://4770c1462f1a493aaa7c840643020fd2@o923427.ingest.sentry.io/5870758",
        tracesSampleRate: 1.0,
    });
    _transaction = Sentry.startTransaction({
        op: "bahamut-automation",
        name: "Bahamut Automation Bug Tracking",
    });
}

function sentryCaptureException(err) {
    Sentry.captureException(err);
}

function finishTransaction() {
    _transaction.finish();
}

exports.sentryInit = sentryInit;
exports.sentryCaptureException = sentryCaptureException;
exports.finishTransaction = finishTransaction;
