const Sentry = require("@sentry/node");

let _transaction;

function sentry_init() {
    Sentry.init({
        dsn: "https://4770c1462f1a493aaa7c840643020fd2@o923427.ingest.sentry.io/5870758",
        tracesSampleRate: 0.1,
    });
    _transaction = Sentry.startTransaction({
        op: "bahamut-automation",
        name: "Bahamut Automation Bug Tracking",
    });
}

function sentry_capture_exception(err) {
    if (_transaction) Sentry.captureException(err);
}

function finish_transaction() {
    _transaction.finish();
}

module.exports = { sentry_init, sentry_capture_exception, finish_transaction };
